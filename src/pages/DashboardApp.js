// import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import {Grid, Container, Typography, Card, IconButton} from '@mui/material';
// components
import 'echarts/extension/bmap/bmap';
import {faker} from "@faker-js/faker";
import {useNavigate} from "react-router-dom";
// import {useEffect} from "react";
import {Refresh} from "@mui/icons-material";
import Page from '../components/Page';
// import Iconify from '../components/Iconify';
// sections
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import Echarts from "./Echarts";

// ----------------------------------------------------------------------
export default function DashboardApp() {
  const theme = useTheme();
  const navigate = useNavigate();

  // useEffect(()=>{
  //         setTimeout(()=>{
  //             navigate('/manage/app');
  //         },2000)
  //
  //     return(()=>{
  //
  //     });
  // },[]);
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 2 }}>
          数据分析
        </Typography>
          <IconButton onClick={()=>{
              navigate('/manage/app');
          }}>
              <Refresh color="secondary"/>
          </IconButton>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="AP设备总数" total={Number(faker.commerce.price(300, 400))} icon={'akar-icons:watch-device'} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="在线总人数" total={Number(faker.commerce.price(2000, 3000))} color="info" icon={'fluent:people-20-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AppWidgetSummary title="物联设备在线数" total={Number(faker.commerce.price(500, 700))} color="success" icon={'ic:baseline-device-hub'} />
          </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <AppCurrentVisits
                    title="AP设备情况"
                    chartData={[
                        { label: '在线', value: Number(faker.commerce.price(200, 400))},
                        { label: '离线', value: Number(faker.commerce.price(20, 50)) },
                        { label: '损坏', value: Number(faker.commerce.price(5, 10)) },
                        // { label: 'Africa', value: 4443 },
                    ]}
                    chartColors={[
                        theme.palette.chart.green[1],
                        theme.palette.chart.blue[0],
                        theme.palette.chart.yellow[0],
                        // theme.palette.chart.yellow[0],
                    ]}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
                <Card>
                    <Echarts />
                </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <AppCurrentSubject
                    title="客流分析"
                    chartLabels={['换乘倾向', '满意度', '舒适度', '大龄用户']}
                    chartData={[
                        { name: '第一季度', data: [80, 50, 30, 40] },
                        { name: '第二季度', data: [20, 30, 40, 80] },
                        { name: '第三季度', data: [44, 76, 78, 13] },
                    ]}
                    chartColors={[...Array(4)].map(() => theme.palette.text.secondary)}
                />
            </Grid>
          {/* <Grid item xs={12} sm={6} md={3}> */}
          {/*  <AppWidgetSummary title="AP设备" total={234} color="error" icon={'akar-icons:watch-device'} /> */}
          {/* </Grid> */}

          <Grid item xs={12} md={6} lg={6}>
            <AppWebsiteVisits
              title="公交车人流量"
              subheader="(+43%) 高于过去一年"
              chartLabels={[
                '06/01/2021',
                '07/01/2021',
                '08/01/2021',
                '09/01/2021',
                '10/01/2021',
                '11/01/2021',
                '12/01/2021',
                '01/01/2022',
                '02/01/2022',
                '03/01/2022',
                '04/01/2022',
              ]}
              chartData={[
                {
                  name: '公交数',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 18, 22, 27, 16, 22, 37, 21, 32, 22, 30],
                },
                {
                  name: '客流变化',
                  type: 'area',
                  fill: 'gradient',
                  data: [30, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: '月客流',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 55, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>


          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title="客流最大的十辆车"
              // subheader="(+43%) than last year"
              chartData={[
                { label: '38路', value: 400 },
                { label: '55路', value: 430 },
                { label: '25路', value: 448 },
                { label: '10路', value: 470 },
                { label: '5路', value: 540 },
                { label: '128路', value: 580 },
                { label: '130路', value: 690 },
                { label: '93路', value: 1100 },
                { label: '950路', value: 1200 },
                { label: '959路', value: 1380 },
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}> */}
          {/*  <AppNewsUpdate */}
          {/*    title="News Update" */}
          {/*    list={[...Array(5)].map((_, index) => ({ */}
          {/*      id: faker.datatype.uuid(), */}
          {/*      title: faker.name.jobTitle(), */}
          {/*      description: faker.name.jobTitle(), */}
          {/*      image: `/static/mock-images/covers/cover_${index + 1}.jpg`, */}
          {/*      postedAt: faker.date.recent(), */}
          {/*    }))} */}
          {/*  /> */}
          {/* </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}> */}
          {/*  <AppOrderTimeline */}
          {/*    title="Order Timeline" */}
          {/*    list={[...Array(5)].map((_, index) => ({ */}
          {/*      id: faker.datatype.uuid(), */}
          {/*      title: [ */}
          {/*        '1983, orders, $4220', */}
          {/*        '12 Invoices have been paid', */}
          {/*        'Order #37745 from September', */}
          {/*        'New order placed #XF-2356', */}
          {/*        'New order placed #XF-2346', */}
          {/*      ][index], */}
          {/*      type: `order${index + 1}`, */}
          {/*      time: faker.date.past(), */}
          {/*    }))} */}
          {/*  /> */}
          {/* </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}> */}
          {/*  <AppTrafficBySite */}
          {/*    title="Traffic by Site" */}
          {/*    list={[ */}
          {/*      { */}
          {/*        name: 'FaceBook', */}
          {/*        value: 323234, */}
          {/*        icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} height={32} />, */}
          {/*      }, */}
          {/*      { */}
          {/*        name: 'Google', */}
          {/*        value: 341212, */}
          {/*        icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} height={32} />, */}
          {/*      }, */}
          {/*      { */}
          {/*        name: 'Linkedin', */}
          {/*        value: 411213, */}
          {/*        icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} height={32} />, */}
          {/*      }, */}
          {/*      { */}
          {/*        name: 'Twitter', */}
          {/*        value: 443232, */}
          {/*        icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} height={32} />, */}
          {/*      }, */}
          {/*    ]} */}
          {/*  /> */}
          {/* </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}> */}
          {/*  <AppTasks */}
          {/*    title="Tasks" */}
          {/*    list={[ */}
          {/*      { id: '1', label: 'Create FireStone Logo' }, */}
          {/*      { id: '2', label: 'Add SCSS and JS files if required' }, */}
          {/*      { id: '3', label: 'Stakeholder Meeting' }, */}
          {/*      { id: '4', label: 'Scoping & Estimations' }, */}
          {/*      { id: '5', label: 'Sprint Showcase' }, */}
          {/*    ]} */}
          {/*  /> */}
          {/* </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
