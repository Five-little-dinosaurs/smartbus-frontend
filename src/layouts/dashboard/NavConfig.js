// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: '数据展板',
    path: '/manage/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: '详细数据',
    path: '/manage/busdetail',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: '公交',
    path: '/manage/bus',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: '司机',
    path: '/manage/driver',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: '乘客',
    path: '/manage/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'product',
    path: '/manage/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'blog',
    path: '/manage/blog',
    icon: getIcon('eva:file-text-fill'),
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon('eva:alert-triangle-fill'),
  },
];

export default navConfig;
