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
    icon: getIcon('majesticons:checkbox-list-detail'),
  },
  {
    title: '公交信息',
    path: '/manage/bus',
    icon: getIcon('ic:round-directions-bus'),
  },
  {
    title: '司机信息',
    path: '/manage/driver',
    icon: getIcon('healthicons:truck-driver'),
  },
  {
    title: '反馈处理',
    path: '/manage/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: '路线优化',
    path: '/manage/busroute',
    icon: getIcon('eos-icons:route'),
  },
  {
    title: '用户日志管理',
    path: '/manage/userLogInfo',
    icon: getIcon('bi:clipboard2-data'),
  },
  {
    title: '设备日志管理',
    path: '/manage/deviceLogInfo',
    icon: getIcon('bi:clipboard2-data'),
  },
  // {
  //   title: 'product',
  //   path: '/manage/products',
  //   icon: getIcon('eva:shopping-bag-fill'),
  // },
  // {
  //   title: 'blog',
  //   path: '/manage/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
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
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
