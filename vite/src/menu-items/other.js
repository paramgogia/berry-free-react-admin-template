// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'Inventory',
      type: 'item',
      url: '/sample-page',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'sales-page',
      title: 'Sales',
      type: 'item',
      url: '/sales-page',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'purchase-page',
      title: 'Purchase',
      type: 'item',
      url: '/sales-page',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'inventory-bot',
      title: 'Inventory Bot',
      type: 'item',
      url: '/inventory-bot',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'sales-forecast',
      title: 'Sales Forecast',
      type: 'item',
      url: '/sales-forecast',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    }
    // {
    //   id: 'documentation',
    //   title: 'Documentation',
    //   type: 'item',
    //   url: 'https://codedthemes.gitbook.io/berry/',
    //   icon: icons.IconHelp,
    //   external: true,
    //   target: true
    // }
  ]
};

export default other;
