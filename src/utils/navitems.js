// src/utils/navItems.js

import {
  BsPerson,
  BsBoxSeam,
  BsGear,
  BsGrid,
  BsBook,
  BsPeople,
  BsInfoCircle,
  BsPieChart,
  BsStar,
  BsHeart,
  BsGearWide,
  BsFileEarmarkCheck,
  BsFileEarmarkSpreadsheet,
  BsFileEarmarkBreak,
} from 'react-icons/bs'

// ============================================================
// ROLES
// ============================================================
export const ROLES = {
  ADMIN:   'admin',
  MANAGER: 'manager',
  USER:    'user',
}

// ============================================================
// NAV ITEMS — Exact DexignZone W3CMS HTML se extract kiya
// ============================================================
export const ALL_NAV_ITEMS = [

  // ─────────────────────────────────────────────────────────
  // 1. USER MODULE  (badge: Modules) — Sirf Admin
  // ─────────────────────────────────────────────────────────
  {
    id: 'user-module',
    label: 'User',
    badge: 'Modules',
    icon: BsPerson,
    roles: [ROLES.ADMIN],
    children: [
      {
        id: 'users',
        label: 'Users',
        path: '/dashboard/users',
        roles: [ROLES.ADMIN],
      },
      {
        id: 'groups',
        label: 'Groups',
        path: '/dashboard/groups',
        roles: [ROLES.ADMIN],
      },
      {
        id: 'permissions',
        label: 'Permissions',
        path: '/dashboard/permissions',
        roles: [ROLES.ADMIN],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 2. CMS MODULE  (badge: Modules) — Admin + Manager
  // ─────────────────────────────────────────────────────────
  {
    id: 'cms-module',
    label: 'CMS',
    badge: 'Modules',
    icon: BsBoxSeam,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    children: [
      {
        id: 'cms-page',
        label: 'Page',
        path: '/dashboard/pages',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'cms-blog',
        label: 'Blog',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
        children: [
          {
            id: 'cms-blog-all',
            label: 'Blogs',
            path: '/dashboard/blogs',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            id: 'cms-blog-categories',
            label: 'Categories',
            path: '/dashboard/blogs/categories',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            id: 'cms-blog-tags',
            label: 'Tags',
            path: '/dashboard/blogs/tags',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
        ],
      },
      {
        id: 'cms-comment',
        label: 'Comment',
        path: '/dashboard/comments',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'cms-menu-setup',
        label: 'Menu Setup',
        path: '/dashboard/menus/setup',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'cms-subscribers',
        label: 'Subscribers',
        path: '/dashboard/subscribe',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'cms-contact',
        label: 'Contact Us',
        path: '/dashboard/contact-us',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 3. CONFIG MODULE  (badge: Modules) — Sirf Admin
  // ─────────────────────────────────────────────────────────
  {
    id: 'config-module',
    label: 'Config',
    badge: 'Modules',
    icon: BsGear,
    roles: [ROLES.ADMIN],
    children: [
      {
        id: 'config-site',
        label: 'Site',
        path: '/dashboard/configurations/prefix/Site',
        roles: [ROLES.ADMIN],
      },
      {
        id: 'config-reading',
        label: 'Reading',
        path: '/dashboard/configurations/prefix/Reading',
        roles: [ROLES.ADMIN],
      },
      {
        id: 'config-social',
        label: 'Social',
        path: '/dashboard/configurations/prefix/Social',
        roles: [ROLES.ADMIN],
      },
      {
        id: 'config-widget',
        label: 'Widget',
        path: '/dashboard/configurations/prefix/Widget',
        roles: [ROLES.ADMIN],
      },
      {
        id: 'config-theme',
        label: 'Theme',
        path: '/dashboard/configurations/prefix/Theme',
        roles: [ROLES.ADMIN],
      },
      {
        id: 'config-configurations',
        label: 'Configurations',
        path: '/dashboard/configurations',
        roles: [ROLES.ADMIN],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 4. DASHBOARD — Admin + Manager + User
  // ─────────────────────────────────────────────────────────
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BsGrid,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
    children: [
      {
        id: 'dashboard-light',
        label: 'Dashboard Light',
        path: '/dashboard/index',
        roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
      },
      {
        id: 'dashboard-dark',
        label: 'Dashboard Dark',
        path: '/dashboard/index-2',
        roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
      },
      {
        id: 'dashboard-schedule',
        label: 'Schedule',
        path: '/dashboard/schedule',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'dashboard-instructors',
        label: 'Instructors',
        path: '/dashboard/instructors',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'dashboard-message',
        label: 'Message',
        path: '/dashboard/message',
        roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
      },
      {
        id: 'dashboard-activity',
        label: 'Activity',
        path: '/dashboard/activity',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'dashboard-profile',
        label: 'Profile',
        path: '/dashboard/profile',
        roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 5. COURSES — Admin + Manager + User
  // ─────────────────────────────────────────────────────────
  {
    id: 'courses',
    label: 'Courses',
    icon: BsBook,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
    children: [
      {
        id: 'courses-all',
        label: 'Courses',
        path: '/dashboard/courses',
        roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
      },
      {
        id: 'courses-details-1',
        label: 'Courses Details 1',
        path: '/dashboard/course-details-1',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'courses-details-2',
        label: 'Courses Details 2',
        path: '/dashboard/course-details-2',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 6. INSTRUCTOR — Admin + Manager
  // ─────────────────────────────────────────────────────────
  {
    id: 'instructor',
    label: 'Instructor',
    icon: BsPeople,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    children: [
      {
        id: 'instructor-dashboard',
        label: 'Dashboard',
        path: '/dashboard/instructor-dashboard',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'instructor-courses',
        label: 'Courses',
        path: '/dashboard/instructor-courses',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'instructor-schedule',
        label: 'Schedule',
        path: '/dashboard/instructor-schedule',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'instructor-students',
        label: 'Students',
        path: '/dashboard/instructor-students',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'instructor-resources',
        label: 'Resources',
        path: '/dashboard/instructor-resources',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'instructor-transactions',
        label: 'Transactions',
        path: '/dashboard/instructor-transactions',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'instructor-liveclass',
        label: 'Live class',
        path: '/dashboard/instructor-liveclass',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 7. APPS — Admin + Manager
  // ─────────────────────────────────────────────────────────
  {
    id: 'apps',
    label: 'Apps',
    icon: BsInfoCircle,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    children: [
      {
        id: 'apps-profile',
        label: 'Profile',
        path: '/dashboard/app-profile',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'apps-post-details',
        label: 'Post Details',
        path: '/dashboard/post-details',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'apps-email',
        label: 'Email',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
        children: [
          {
            id: 'email-compose',
            label: 'Compose',
            path: '/dashboard/email-compose',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            id: 'email-inbox',
            label: 'Inbox',
            path: '/dashboard/email-inbox',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            id: 'email-read',
            label: 'Read',
            path: '/dashboard/email-read',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
        ],
      },
      {
        id: 'apps-calendar',
        label: 'Calendar',
        path: '/dashboard/app-calender',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'apps-shop',
        label: 'Shop',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
        children: [
          {
            id: 'shop-product-grid',
            label: 'Product Grid',
            path: '/dashboard/ecom-product-grid',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            id: 'shop-product-list',
            label: 'Product List',
            path: '/dashboard/ecom-product-list',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            id: 'shop-product-detail',
            label: 'Product Details',
            path: '/dashboard/ecom-product-detail',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            id: 'shop-order',
            label: 'Order',
            path: '/dashboard/ecom-product-order',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            id: 'shop-checkout',
            label: 'Checkout',
            path: '/dashboard/ecom-checkout',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            id: 'shop-invoice',
            label: 'Invoice',
            path: '/dashboard/ecom-invoice',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            id: 'shop-customers',
            label: 'Customers',
            path: '/dashboard/ecom-customers',
            roles: [ROLES.ADMIN, ROLES.MANAGER],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 8. CHARTS — Admin + Manager
  // ─────────────────────────────────────────────────────────
  {
    id: 'charts',
    label: 'Charts',
    icon: BsPieChart,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    children: [
      { id: 'chart-flot',      label: 'Flot',      path: '/dashboard/chart-flot',      roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'chart-morris',    label: 'Morris',    path: '/dashboard/chart-morris',    roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'chart-chartjs',   label: 'Chartjs',   path: '/dashboard/chart-chartjs',   roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'chart-chartist',  label: 'Chartist',  path: '/dashboard/chart-chartist',  roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'chart-sparkline', label: 'Sparkline', path: '/dashboard/chart-sparkline', roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'chart-peity',     label: 'Peity',     path: '/dashboard/chart-peity',     roles: [ROLES.ADMIN, ROLES.MANAGER] },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 9. BOOTSTRAP — Sirf Admin
  // ─────────────────────────────────────────────────────────
  {
    id: 'bootstrap',
    label: 'Bootstrap',
    icon: BsStar,
    roles: [ROLES.ADMIN],
    children: [
      { id: 'ui-accordion',    label: 'Accordion',    path: '/dashboard/ui-accordion',    roles: [ROLES.ADMIN] },
      { id: 'ui-alert',        label: 'Alert',        path: '/dashboard/ui-alert',        roles: [ROLES.ADMIN] },
      { id: 'ui-badge',        label: 'Badge',        path: '/dashboard/ui-badge',        roles: [ROLES.ADMIN] },
      { id: 'ui-button',       label: 'Button',       path: '/dashboard/ui-button',       roles: [ROLES.ADMIN] },
      { id: 'ui-modal',        label: 'Modal',        path: '/dashboard/ui-modal',        roles: [ROLES.ADMIN] },
      { id: 'ui-button-group', label: 'Button Group', path: '/dashboard/ui-button-group', roles: [ROLES.ADMIN] },
      { id: 'ui-list-group',   label: 'List Group',   path: '/dashboard/ui-list-group',   roles: [ROLES.ADMIN] },
      { id: 'ui-card',         label: 'Cards',        path: '/dashboard/ui-card',         roles: [ROLES.ADMIN] },
      { id: 'ui-carousel',     label: 'Carousel',     path: '/dashboard/ui-carousel',     roles: [ROLES.ADMIN] },
      { id: 'ui-dropdown',     label: 'Dropdown',     path: '/dashboard/ui-dropdown',     roles: [ROLES.ADMIN] },
      { id: 'ui-popover',      label: 'Popover',      path: '/dashboard/ui-popover',      roles: [ROLES.ADMIN] },
      { id: 'ui-progressbar',  label: 'Progressbar',  path: '/dashboard/ui-progressbar',  roles: [ROLES.ADMIN] },
      { id: 'ui-tab',          label: 'Tab',          path: '/dashboard/ui-tab',          roles: [ROLES.ADMIN] },
      { id: 'ui-typography',   label: 'Typography',   path: '/dashboard/ui-typography',   roles: [ROLES.ADMIN] },
      { id: 'ui-pagination',   label: 'Pagination',   path: '/dashboard/ui-pagination',   roles: [ROLES.ADMIN] },
      { id: 'ui-grid',         label: 'Grid',         path: '/dashboard/ui-grid',         roles: [ROLES.ADMIN] },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 10. PLUGINS — Sirf Admin
  // ─────────────────────────────────────────────────────────
  {
    id: 'plugins',
    label: 'Plugins',
    icon: BsHeart,
    roles: [ROLES.ADMIN],
    children: [
      { id: 'uc-select2',      label: 'Select 2',      path: '/dashboard/uc-select2',      roles: [ROLES.ADMIN] },
      { id: 'uc-nestable',     label: 'NestedTable',   path: '/dashboard/uc-nestable',     roles: [ROLES.ADMIN] },
      { id: 'uc-noui-slider',  label: 'Noui Slider',   path: '/dashboard/uc-noui-slider',  roles: [ROLES.ADMIN] },
      { id: 'uc-sweetalert',   label: 'Sweet Alert',   path: '/dashboard/uc-sweetalert',   roles: [ROLES.ADMIN] },
      { id: 'uc-toastr',       label: 'Toastr',        path: '/dashboard/uc-toastr',       roles: [ROLES.ADMIN] },
      { id: 'map-jqvmap',      label: 'Jqv Map',       path: '/dashboard/map-jqvmap',      roles: [ROLES.ADMIN] },
      { id: 'uc-lightgallery', label: 'Light Gallery', path: '/dashboard/uc-lightgallery', roles: [ROLES.ADMIN] },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 11. WIDGET — Sirf Admin
  // ─────────────────────────────────────────────────────────
  {
    id: 'widget',
    label: 'Widget',
    path: '/dashboard/widget-basic',
    icon: BsGearWide,
    roles: [ROLES.ADMIN],
  },

  // ─────────────────────────────────────────────────────────
  // 12. FORMS — Admin + Manager
  // ─────────────────────────────────────────────────────────
  {
    id: 'forms',
    label: 'Forms',
    icon: BsFileEarmarkCheck,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    children: [
      { id: 'form-element',    label: 'Form Elements', path: '/dashboard/form-element',    roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'form-wizard',     label: 'Wizard',        path: '/dashboard/form-wizard',     roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'form-ckeditor',   label: 'CkEditor',      path: '/dashboard/form-ckeditor',   roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'form-pickers',    label: 'Pickers',       path: '/dashboard/form-pickers',    roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'form-validation', label: 'Form Validate', path: '/dashboard/form-validation', roles: [ROLES.ADMIN, ROLES.MANAGER] },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 13. TABLE — Admin + Manager
  // ─────────────────────────────────────────────────────────
  {
    id: 'table',
    label: 'Table',
    icon: BsFileEarmarkSpreadsheet,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    children: [
      { id: 'table-bootstrap', label: 'Bootstrap',  path: '/dashboard/table-bootstrap-basic', roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'table-datatable', label: 'Datatable',  path: '/dashboard/table-datatable-basic', roles: [ROLES.ADMIN, ROLES.MANAGER] },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 14. PAGES — Sirf Admin
  // ─────────────────────────────────────────────────────────
  {
    id: 'pages',
    label: 'Pages',
    icon: BsFileEarmarkBreak,
    roles: [ROLES.ADMIN],
    children: [
      {
        id: 'pages-error',
        label: 'Error',
        roles: [ROLES.ADMIN],
        children: [
          { id: 'error-400', label: 'Error 400', path: '/dashboard/page-error-400', roles: [ROLES.ADMIN] },
          { id: 'error-403', label: 'Error 403', path: '/dashboard/page-error-403', roles: [ROLES.ADMIN] },
          { id: 'error-404', label: 'Error 404', path: '/dashboard/page-error-404', roles: [ROLES.ADMIN] },
          { id: 'error-500', label: 'Error 500', path: '/dashboard/page-error-500', roles: [ROLES.ADMIN] },
          { id: 'error-503', label: 'Error 503', path: '/dashboard/page-error-503', roles: [ROLES.ADMIN] },
        ],
      },
      { id: 'page-lock-screen', label: 'Lock Screen', path: '/dashboard/page-lock-screen', roles: [ROLES.ADMIN] },
      { id: 'page-empty',       label: 'Empty Page',  path: '/dashboard/empty-page',        roles: [ROLES.ADMIN] },
    ],
  },
]

// ============================================================
// HELPER — Role ke basis pe recursive filter
// ============================================================
export const getNavItemsByRole = (role) => {
  if (!role) return []
  const normalizedRole = role.toLowerCase()
  const filterItems = (items) => {
    return items
    .filter((item) => item.roles.includes(normalizedRole)) 
      .map((item) => ({
        ...item,
        ...(item.children && {
          children: filterItems(item.children),
        }),
      }))
      .filter((item) => !item.children || item.children.length > 0)
  }

  return filterItems(ALL_NAV_ITEMS)
}