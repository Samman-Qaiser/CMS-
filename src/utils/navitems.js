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
  CUSTOMER: 'customer',
  INSTRUCTOR:'instructor'
}

// ============================================================
// NAV ITEMS
// ============================================================
export const ALL_NAV_ITEMS = [

  // 1. USER MODULE
  {
    id: 'user-module',
    label: 'nav.user',
    badge: 'nav.modules',
    icon: BsPerson,
    roles: [ROLES.ADMIN , ROLES.MANAGER] ,
    children: [
      { id: 'users',       label: 'nav.users',       path: '/dashboard/users',      
         roles: [ROLES.ADMIN ,ROLES.MANAGER] },
      { id: 'groups',      label: 'nav.groups',      path: '/dashboard/groups',      roles: [ROLES.ADMIN] },
      { id: 'permissions', label: 'nav.permissions', path: '/dashboard/permissions', roles: [ROLES.ADMIN] },
    ],
  },

  // 2. CMS MODULE
  {
    id: 'cms-module',
    label: 'nav.cms',
    badge: 'nav.modules',
    icon: BsBoxSeam,
    roles: [ROLES.ADMIN, ROLES.MANAGER],
    children: [
      {
        id: 'cms-page',
        label: 'nav.page',
        path: '/dashboard/pages',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: 'cms-blog',
        label: 'nav.blog',
        roles: [ROLES.ADMIN, ROLES.MANAGER],
        children: [
          { id: 'cms-blog-all',        label: 'nav.blogs',      path: '/dashboard/blogs',            roles: [ROLES.ADMIN, ROLES.MANAGER] },
          { id: 'cms-blog-categories', label: 'nav.categories', path: '/dashboard/blogs/categories', roles: [ROLES.ADMIN, ROLES.MANAGER] },
          { id: 'cms-blog-tags',       label: 'nav.tags',       path: '/dashboard/blogs/tags',       roles: [ROLES.ADMIN, ROLES.MANAGER] },
        ],
      },
      { id: 'cms-comment',      label: 'nav.comment',     path: '/dashboard/comments',      roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'cms-menu-setup',   label: 'nav.menuSetup',   path: '/dashboard/menus/setup',   roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'cms-subscribers',  label: 'nav.subscribers', path: '/dashboard/subscribers',     roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'cms-contact',      label: 'nav.contactUs',   path: '/dashboard/contact-us',    roles: [ROLES.ADMIN, ROLES.MANAGER] },
    ],
  },

  // 3. CONFIG MODULE
  {
    id: 'config-module',
    label: 'nav.config',
    badge: 'nav.modules',
    icon: BsGear,
    roles: [ROLES.ADMIN],
    children: [
      { id: 'config-site',           label: 'nav.site',           path: '/dashboard/configurations/prefix/Site',    roles: [ROLES.ADMIN] },
      { id: 'config-reading',        label: 'nav.reading',        path: '/dashboard/configurations/prefix/Reading', roles: [ROLES.ADMIN] },
      { id: 'config-social',         label: 'nav.social',         path: '/dashboard/configurations/prefix/Social',  roles: [ROLES.ADMIN] },
      { id: 'config-widget',         label: 'nav.widget',         path: '/dashboard/configurations/prefix/Widget',  roles: [ROLES.ADMIN] },
      { id: 'config-theme',          label: 'nav.theme',          path: '/dashboard/configurations/prefix/Theme',   roles: [ROLES.ADMIN] },
      { id: 'config-configurations', label: 'nav.configurations', path: '/dashboard/configurations',                roles: [ROLES.ADMIN] },
    ],
  },

  // 4. DASHBOARD
  {
    id: 'dashboard',
    label: 'nav.dashboard',
    icon: BsGrid,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CUSTOMER ,ROLES.INSTRUCTOR],
    children: [
      { id: 'dashboard-light',       label: 'nav.dashboardLight', path: '/dashboard/index',        roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CUSTOMER ,ROLES.INSTRUCTOR] },
      { id: 'dashboard-dark',        label: 'nav.dashboardDark',  path: '/dashboard/index-2',      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
      { id: 'dashboard-schedule',    label: 'nav.schedule',       path: '/dashboard/schedule',     roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'dashboard-instructors', label: 'nav.instructors',    path: '/dashboard/instructors',  roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'instructor-applications',     label: 'Instructor Applications',        path: '/dashboard/admin/instructor-applications',      roles: [ROLES.ADMIN] },
      { id: 'reviews',     label: 'Reviews',        path: '/dashboard/reviews',      roles: [ROLES.ADMIN] },
      { id: 'dashboard-message',     label: 'nav.message',        path: '/dashboard/message',      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
      { id: 'dashboard-activity',    label: 'nav.activity',       path: '/dashboard/activity',     roles: [ROLES.ADMIN, ROLES.MANAGER] },
      { id: 'dashboard-profile',     label: 'nav.profile',        path: '/dashboard/profile',      roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
    ],
  },

  // 5. COURSES
  {
    id: 'courses',
    label: 'nav.courses',
    icon: BsBook,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CUSTOMER,ROLES.INSTRUCTOR],
    children: [
      { id: 'courses-all',       label: 'nav.courses',        path: '/dashboard/courses',          roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
      { id: 'chapters', label: 'Chapters',path: '/dashboard/chapters', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.INSTRUCTOR] },
      { id: 'lessons', label: 'Lessons',path: '/dashboard/lessons', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.INSTRUCTOR] },
    ],
  },

  // 6. INSTRUCTOR
  {
    id: 'instructor',
    label: 'nav.instructor',
    icon: BsPeople,
    roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.INSTRUCTOR,ROLES.CUSTOMER],
    children: [
      { id: 'instructor-dashboard',    label: 'nav.instructorDashboard',    path: '/dashboard/instructor-dashboard',    roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.INSTRUCTOR] },
      { id: 'instructor-courses',      label: 'nav.instructorCourses',      path: '/dashboard/instructor-courses',      roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.INSTRUCTOR] },
      { id: 'instructor-schedule',     label: 'nav.instructorSchedule',     path: '/dashboard/instructor-schedule',     roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.INSTRUCTOR] },
      { id: 'instructor-students',     label: 'nav.instructorStudents',     path: '/dashboard/instructor-students',     roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.INSTRUCTOR] },
      { id: 'instructor-resources',    label: 'nav.instructorResources',    path: '/dashboard/instructor-resources',    roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.INSTRUCTOR] },
      { id: 'instructor-transactions', label: 'nav.instructorTransactions', path: '/dashboard/instructor-transactions', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.INSTRUCTOR] },
      { id: 'instructor-liveclass',    label: 'nav.instructorLiveclass',    path: '/dashboard/live-classes',    roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.INSTRUCTOR,ROLES.CUSTOMER] },
    ],
  },

  // 7. APPS
  {
    id: 'apps',
    label: 'nav.apps',
    icon: BsInfoCircle,
    roles: [ROLES.ADMIN, ROLES.MANAGER ,ROLES.CUSTOMER,ROLES.INSTRUCTOR],
    children: [
      { id: 'apps-profile',      label: 'nav.profile',     path: '/dashboard/app-profile',  roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
      { id: 'apps-post-details', label: 'nav.postDetails', path: '/dashboard/post-details', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
      {
        id: 'apps-email',
        label: 'nav.email',
        roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR],
        children: [
          { id: 'email-compose', label: 'nav.compose', path: '/dashboard/email-compose', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
          { id: 'email-inbox',   label: 'nav.inbox',   path: '/dashboard/email-inbox',   roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
          { id: 'email-read',    label: 'nav.read',    path: '/dashboard/email-read',    roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
        ],
      },
      { id: 'apps-calendar', label: 'nav.calendar', path: '/dashboard/app-calender', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
      {
        id: 'apps-shop',
        label: 'nav.shop',
        roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR],
        children: [
          { id: 'shop-product-create', label: 'nav.createproduct',  path: '/dashboard/', roles: [ROLES.ADMIN] },
          { id: 'shop-product-grid',   label: 'nav.productGrid',    path: '/dashboard/ecom-product-grid',   roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
          { id: 'shop-product-list',   label: 'nav.productList',    path: '/dashboard/ecom-product-list',   roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
          { id: 'shop-product-detail', label: 'nav.productDetails', path: '/dashboard/ecom-product-detail', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
          { id: 'shop-order',          label: 'nav.order',          path: '/dashboard/ecom-product-order',  roles: [ROLES.ADMIN, ROLES.MANAGER,] },
          { id: 'shop-checkout',       label: 'nav.checkout',       path: '/dashboard/ecom-checkout',       roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.INSTRUCTOR,ROLES.CUSTOMER] },
          { id: 'shop-invoice',        label: 'nav.invoice',        path: '/dashboard/ecom-invoice',        roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER,ROLES.INSTRUCTOR] },
          { id: 'shop-customers',      label: 'nav.customers',      path: '/dashboard/ecom-customers',      roles: [ROLES.ADMIN, ROLES.MANAGER] },
        ],
      },
    ],
  },

  // 8. CHARTS
  {
    id: 'charts',
    label: 'nav.charts',
    icon: BsPieChart,
    roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER],
    children: [
      { id: 'chart-flot',      label: 'nav.flot',      path: '/dashboard/chart-flot',      roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'chart-morris',    label: 'nav.morris',    path: '/dashboard/chart-morris',    roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'chart-chartjs',   label: 'nav.chartjs',   path: '/dashboard/chart-chartjs',   roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'chart-chartist',  label: 'nav.chartist',  path: '/dashboard/chart-chartist',  roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'chart-sparkline', label: 'nav.sparkline', path: '/dashboard/chart-sparkline', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'chart-peity',     label: 'nav.peity',     path: '/dashboard/chart-peity',     roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
    ],
  },

  // 9. BOOTSTRAP
  {
    id: 'bootstrap',
    label: 'nav.bootstrap',
    icon: BsStar,
    roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER],
    children: [
      { id: 'ui-accordion',    label: 'nav.accordion',    path: '/dashboard/ui-accordion',    roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-alert',        label: 'nav.alert',        path: '/dashboard/ui-alert',        roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-badge',        label: 'nav.badge',        path: '/dashboard/ui-badge',        roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-button',       label: 'nav.button',       path: '/dashboard/ui-button',       roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-modal',        label: 'nav.modal',        path: '/dashboard/ui-modal',        roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-button-group', label: 'nav.buttonGroup',  path: '/dashboard/ui-button-group', roles: [ROLES.ADMIN] },
      { id: 'ui-list-group',   label: 'nav.listGroup',    path: '/dashboard/ui-list-group',   roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-card',         label: 'nav.cards',        path: '/dashboard/ui-card',         roles: [ROLES.ADMIN] },
      { id: 'ui-carousel',     label: 'nav.carousel',     path: '/dashboard/ui-carousel',     roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-dropdown',     label: 'nav.dropdown',     path: '/dashboard/ui-dropdown',     roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-popover',      label: 'nav.popover',      path: '/dashboard/ui-popover',      roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-progressbar',  label: 'nav.progressbar',  path: '/dashboard/ui-progressbar',  roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-tab',          label: 'nav.tab',          path: '/dashboard/ui-tab',          roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-typography',   label: 'nav.typography',   path: '/dashboard/ui-typography',   roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'ui-pagination',   label: 'nav.pagination',   path: '/dashboard/ui-pagination',   roles: [ROLES.ADMIN] },
      { id: 'ui-grid',         label: 'nav.grid',         path: '/dashboard/ui-grid',         roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
    ],
  },

  // 10. PLUGINS
  {
    id: 'plugins',
    label: 'nav.plugins',
    icon: BsHeart,
    roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER],
    children: [
      { id: 'uc-select2',      label: 'nav.select2',      path: '/dashboard/uc-select2',      roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'uc-nestable',     label: 'nav.nestedTable',  path: '/dashboard/uc-nestable',     roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'uc-noui-slider',  label: 'nav.nouiSlider',   path: '/dashboard/uc-noui-slider',  roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'uc-sweetalert',   label: 'nav.sweetAlert',   path: '/dashboard/uc-sweetalert',   roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'uc-toastr',       label: 'nav.toastr',       path: '/dashboard/uc-toastr',       roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'map-jqvmap',      label: 'nav.jqvMap',       path: '/dashboard/map-jqvmap',      roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'uc-lightgallery', label: 'nav.lightGallery', path: '/dashboard/uc-lightgallery', roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
    ],
  },

  // 11. WIDGET
  {
    id: 'widget',
    label: 'nav.widget',
    path: '/dashboard/widget-basic',
    icon: BsGearWide,
    roles: [ROLES.ADMIN ,ROLES.MANAGER,ROLES.CUSTOMER],
  },

  // 12. FORMS
  {
    id: 'forms',
    label: 'nav.forms',
    icon: BsFileEarmarkCheck,
    roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER],
    children: [
      { id: 'form-element',    label: 'nav.formElements', path: '/dashboard/form-element',    roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'form-wizard',     label: 'nav.wizard',       path: '/dashboard/form-wizard',     roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'form-ckeditor',   label: 'nav.ckEditor',     path: '/dashboard/form-ckeditor',   roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'form-pickers',    label: 'nav.pickers',      path: '/dashboard/form-pickers',    roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'form-validation', label: 'nav.formValidate', path: '/dashboard/form-validation', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
    ],
  },

  // 13. TABLE
  {
    id: 'table',
    label: 'nav.table',
    icon: BsFileEarmarkSpreadsheet,
    roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER],
    children: [
      { id: 'table-bootstrap', label: 'nav.bootstrap', path: '/dashboard/table-bootstrap-basic', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'table-datatable', label: 'nav.datatable', path: '/dashboard/table-datatable-basic', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
    ],
  },

  // 14. PAGES
  {
    id: 'pages',
    label: 'nav.pages',
    icon: BsFileEarmarkBreak,
    roles: [ROLES.ADMIN ,ROLES.MANAGER,ROLES.CUSTOMER],
    children: [
      {
        id: 'pages-error',
        label: 'nav.error',
        roles: [ROLES.ADMIN],
        children: [
          { id: 'error-400', label: 'nav.error400', path: '/dashboard/page-error-400', roles: [ROLES.ADMIN] },
          { id: 'error-403', label: 'nav.error403', path: '/dashboard/page-error-403', roles: [ROLES.ADMIN] },
          { id: 'error-404', label: 'nav.error404', path: '/dashboard/page-error-404', roles: [ROLES.ADMIN, ROLES.MANAGER,ROLES.CUSTOMER] },
          { id: 'error-500', label: 'nav.error500', path: '/dashboard/page-error-500', roles: [ROLES.ADMIN] },
          { id: 'error-503', label: 'nav.error503', path: '/dashboard/page-error-503', roles: [ROLES.ADMIN] },
        ],
      },
      { id: 'page-lock-screen', label: 'nav.lockScreen', path: '/dashboard/page-lock-screen', roles: [ROLES.ADMIN ,ROLES.MANAGER,ROLES.CUSTOMER] },
      { id: 'page-empty',       label: 'nav.emptyPage',  path: '/dashboard/empty-page',        roles: [ROLES.ADMIN,ROLES.MANAGER,ROLES.CUSTOMER] },
    ],
  },
]

// ============================================================
// HELPER — Role ke basis pe recursive filter
// ============================================================
export const getNavItemsByRole = (role) => {
  if (!role) return []
  const normalizedRole = role.toLowerCase().trim()
  const filterItems = (items) => {
    return items
      .filter((item) => item.roles && item.roles.some(r => r.toLowerCase() === normalizedRole))
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