# Role-Based Access Control (RBAC) Implementation Guide

## Overview
This guide outlines the process to implement role-based access control for the admin dashboard, allowing you to assign different sections to different users. The system will be built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Security Considerations](#security-considerations)
6. [Implementation Steps](#implementation-steps)
7. [Testing Strategy](#testing-strategy)

## System Architecture

### User Roles Structure
```
Super Admin (Level 1)
├── Admin (Level 2)
│   ├── Admissions Manager
│   ├── Course Manager
│   ├── Content Manager
│   └── User Manager
└── Moderator (Level 3)
    ├── Admissions Reviewer
    ├── Content Editor
    └── Support Agent
```

### Section Permissions
```
Dashboard Sections:
├── Admissions Management
│   ├── View Applications
│   ├── Approve/Reject Applications
│   ├── Download Applications
│   └── Manage Status
├── Course Management
│   ├── View Courses
│   ├── Add/Edit Courses
│   ├── Delete Courses
│   └── Manage Programs
├── Content Management
│   ├── About Us
│   ├── Blog Posts
│   ├── News & Events
│   ├── Testimonials
│   └── Gallery
├── User Management
│   ├── View Users
│   ├── Create Users
│   ├── Edit Users
│   └── Delete Users
├── Mentor Management
│   ├── View Mentors
│   ├── Add/Edit Mentors
│   └── Delete Mentors
├── Career Management
│   ├── View Careers
│   ├── Add/Edit Careers
│   └── Manage Applicants
└── System Settings
    ├── Role Management
    ├── Permission Management
    └── System Configuration
```

## Database Schema

### 1. User Schema
```javascript
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 2. Role Schema
```javascript
const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  level: { type: Number, required: true }, // 1: Super Admin, 2: Admin, 3: Moderator
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### 3. Permission Schema
```javascript
const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  resource: { type: String, required: true }, // e.g., 'admissions', 'courses'
  action: { type: String, required: true }, // e.g., 'read', 'write', 'delete'
  section: { type: String, required: true }, // e.g., 'admissions-management'
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```

### 4. UserSession Schema (for tracking)
```javascript
const userSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionToken: { type: String, required: true },
  permissions: [{ type: String }],
  lastActivity: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```

## Backend Implementation

### 1. Authentication Middleware
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .populate('role')
      .populate('permissions');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
```

### 2. Permission Middleware
```javascript
// middleware/permissions.js
const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      // Super admin has all permissions
      if (user.role.level === 1) {
        return next();
      }

      // Check user's direct permissions
      const hasPermission = user.permissions.some(permission => 
        permission.resource === resource && permission.action === action
      );

      // Check role permissions
      const hasRolePermission = user.role.permissions.some(permission => 
        permission.resource === resource && permission.action === action
      );

      if (hasPermission || hasRolePermission) {
        return next();
      }

      return res.status(403).json({ 
        message: `Access denied. Required permission: ${action} on ${resource}` 
      });
    } catch (error) {
      return res.status(500).json({ message: 'Permission check failed' });
    }
  };
};

module.exports = { checkPermission };
```

### 3. Role Management API
```javascript
// routes/roles.js
const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const authenticateToken = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

// Get all roles
router.get('/', authenticateToken, checkPermission('roles', 'read'), async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true }).populate('permissions');
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new role
router.post('/', authenticateToken, checkPermission('roles', 'write'), async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update role
router.put('/:id', authenticateToken, checkPermission('roles', 'write'), async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete role
router.delete('/:id', authenticateToken, checkPermission('roles', 'delete'), async (req, res) => {
  try {
    await Role.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

### 4. User Management API
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');
const bcrypt = require('bcryptjs');

// Get all users
router.get('/', authenticateToken, checkPermission('users', 'read'), async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .populate('role')
      .populate('permissions')
      .select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new user
router.post('/', authenticateToken, checkPermission('users', 'write'), async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new User({
      ...userData,
      password: hashedPassword
    });
    
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update user
router.put('/:id', authenticateToken, checkPermission('users', 'write'), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('role')
      .populate('permissions')
      .select('-password');
      
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete user
router.delete('/:id', authenticateToken, checkPermission('users', 'delete'), async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

## Frontend Implementation

### 1. Permission Context
```typescript
// contexts/PermissionContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Permission {
  _id: string;
  name: string;
  resource: string;
  action: string;
  section: string;
}

interface PermissionContextType {
  permissions: Permission[];
  hasPermission: (resource: string, action: string) => boolean;
  hasSectionAccess: (section: string) => boolean;
  loading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  const fetchUserPermissions = async () => {
    try {
      const response = await fetch('/api/auth/permissions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPermissions(data.permissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    return permissions.some(permission => 
      permission.resource === resource && permission.action === action
    );
  };

  const hasSectionAccess = (section: string): boolean => {
    return permissions.some(permission => permission.section === section);
  };

  return (
    <PermissionContext.Provider value={{ 
      permissions, 
      hasPermission, 
      hasSectionAccess, 
      loading 
    }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};
```

### 2. Protected Route Component
```typescript
// components/ProtectedRoute.tsx
import React from 'react';
import { usePermissions } from '../contexts/PermissionContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  requiredSection?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredSection,
  fallback
}) => {
  const { hasPermission, hasSectionAccess, loading } = usePermissions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  if (requiredSection && !hasSectionAccess(requiredSection)) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

### 3. Dynamic Navigation
```typescript
// components/DynamicNavigation.tsx
import React from 'react';
import { usePermissions } from '../contexts/PermissionContext';

const navigationItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'Home',
    section: 'dashboard'
  },
  {
    title: 'Admissions',
    path: '/dashboard/admissions',
    icon: 'Users',
    section: 'admissions-management',
    permission: { resource: 'admissions', action: 'read' }
  },
  {
    title: 'Courses',
    path: '/dashboard/courses',
    icon: 'BookOpen',
    section: 'course-management',
    permission: { resource: 'courses', action: 'read' }
  },
  {
    title: 'Content',
    path: '/dashboard/webdata',
    icon: 'FileText',
    section: 'content-management',
    permission: { resource: 'content', action: 'read' }
  },
  {
    title: 'Users',
    path: '/dashboard/users',
    icon: 'UserCheck',
    section: 'user-management',
    permission: { resource: 'users', action: 'read' }
  },
  {
    title: 'Mentors',
    path: '/dashboard/mentors',
    icon: 'UserPlus',
    section: 'mentor-management',
    permission: { resource: 'mentors', action: 'read' }
  },
  {
    title: 'Careers',
    path: '/dashboard/careers',
    icon: 'Briefcase',
    section: 'career-management',
    permission: { resource: 'careers', action: 'read' }
  },
  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: 'Settings',
    section: 'system-settings',
    permission: { resource: 'settings', action: 'read' }
  }
];

export const DynamicNavigation: React.FC = () => {
  const { hasPermission, hasSectionAccess } = usePermissions();

  const filteredItems = navigationItems.filter(item => {
    if (item.permission) {
      return hasPermission(item.permission.resource, item.permission.action);
    }
    if (item.section) {
      return hasSectionAccess(item.section);
    }
    return true;
  });

  return (
    <nav>
      {filteredItems.map(item => (
        <NavItem key={item.path} {...item} />
      ))}
    </nav>
  );
};
```

### 4. Permission-Based UI Components
```typescript
// components/PermissionButton.tsx
import React from 'react';
import { usePermissions } from '../contexts/PermissionContext';
import { Button } from './ui/button';

interface PermissionButtonProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  [key: string]: any;
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  resource,
  action,
  children,
  fallback,
  ...props
}) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(resource, action)) {
    return fallback || null;
  }

  return <Button {...props}>{children}</Button>;
};
```

## Security Considerations

### 1. JWT Token Security
```javascript
// utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      role: user.role.name,
      permissions: user.permissions.map(p => `${p.resource}:${p.action}`)
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

### 2. Rate Limiting
```javascript
// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later'
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

### 3. Input Validation
```javascript
// middleware/validation.js
const { body, validationResult } = require('express-validator');

const validateUser = [
  body('username').isLength({ min: 3 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isMongoId(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

## Implementation Steps

### Phase 1: Database Setup
1. Create MongoDB schemas for User, Role, Permission, and UserSession
2. Set up initial roles and permissions
3. Create database indexes for performance

### Phase 2: Backend Implementation
1. Implement authentication middleware
2. Create permission checking middleware
3. Build role and user management APIs
4. Add permission-based route protection
5. Implement session management

### Phase 3: Frontend Implementation
1. Create permission context and hooks
2. Build protected route components
3. Implement dynamic navigation
4. Add permission-based UI components
5. Create role and user management interfaces

### Phase 4: Testing & Security
1. Implement comprehensive testing
2. Add security measures (rate limiting, validation)
3. Perform security audit
4. Create user documentation

### Phase 5: Deployment
1. Set up production environment
2. Configure environment variables
3. Deploy and monitor
4. Create admin documentation

## Testing Strategy

### 1. Unit Tests
```javascript
// tests/permissions.test.js
describe('Permission System', () => {
  test('should check user permissions correctly', () => {
    const user = {
      role: { level: 2 },
      permissions: [
        { resource: 'admissions', action: 'read' }
      ]
    };
    
    expect(hasPermission(user, 'admissions', 'read')).toBe(true);
    expect(hasPermission(user, 'admissions', 'write')).toBe(false);
  });
});
```

### 2. Integration Tests
```javascript
// tests/api/permissions.test.js
describe('Permission API', () => {
  test('should return 403 for unauthorized access', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${invalidToken}`);
    
    expect(response.status).toBe(403);
  });
});
```

### 3. E2E Tests
```javascript
// tests/e2e/permissions.test.js
describe('Permission UI', () => {
  test('should hide unauthorized sections', async () => {
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="users-section"]')).not.toBeVisible();
  });
});
```

## Conclusion

This RBAC implementation provides:
- **Flexible role management**: Easy to create and modify roles
- **Granular permissions**: Fine-grained control over user access
- **Security**: Multiple layers of protection
- **Scalability**: Easy to add new sections and permissions
- **User-friendly**: Intuitive interface for managing access

The system can be extended to include additional features like:
- Audit logging
- Permission inheritance
- Temporary permissions
- Multi-tenant support
- Advanced analytics

Remember to regularly review and update permissions, monitor access patterns, and maintain security best practices. 