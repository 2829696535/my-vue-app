<template>
    <el-row class="home" :gutter="20">
        <!-- 左侧卡片部分 -->
        <el-col :span="12" style="margin-top: 20px;">
            <el-card>
                <div class="user">
                    <img :src="getImageUrl('user')" class="user" />
                    <div class="user-info">
                        <p>{{ user.username }}</p>
                        <p>{{ user.phone }}</p>
                    </div>
                </div>
                <div class="login-info">
                    <p>登录时间: {{ user.loginTime }}</p>
                </div>
            </el-card>
        </el-col>
        <!-- 中间图表部分 -->
        <el-col :span="12" style="margin-top: 20px;">
            <el-card>
                <div class="chart-card">
                    <div ref="pieChartContainer" style="width: 100%; height: 300px;"></div>
                    <div class="chart-title">
                        <h3>数据统计图（饼图）</h3>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="12">
            <el-card>
                <div class="chart-card">
                    <div ref="lineChartContainer" style="width: 100%; height: 300px;"></div>
                    <div class="chart-title">
                        <h3>数据统计图（折线图）</h3>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="12">
            <el-card>
                <div class="chart-card">
                    <div ref="barChartContainer" style="width: 100%; height: 300px;"></div>
                    <div class="chart-title">
                        <h3>数据统计图（柱状图）</h3>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
    data() {
        return {
            lineChartData: [],
            user: {
                username: '',
                phone: '',
                loginTime: ''
            },
            pieChartData: [],
            lineChartData: [820, 932, 901, 934, 1290, 1330, 1320],
            barChartData: [5, 20, 36, 10, 10, 20]
        };
    },
    created(){
       this.getusername()
    },
    methods: {
        getusername(){
            const username = sessionStorage.getItem('username');
            if(username== null ||username ==""){
                window.location.href = '/'
            }
        },
    
        getImageUrl(user) {
            const url = new URL(`../assets/images/${user}.png`, import.meta.url).href;
            console.log('Image URL:', url);
            return url;
        },
        initPieChart() {
            axios.get('http://localhost:8080/api/users')
              .then((response) => {
                    if (response.data.code === 0) {
                        const roleCount = {};
                        response.data.data.forEach((user) => {
                            if (!roleCount[user.role]) {
                                roleCount[user.role] = 1;
                            } else {
                                roleCount[user.role]++;
                            }
                        });
                        this.pieChartData = Object.entries(roleCount).map(([role, count]) => ({
                            name: role,
                            value: count
                        }));
                        const pieChart = echarts.init(this.$refs.pieChartContainer);
                        const option = {
                            tooltip: {
                                trigger: 'item'
                            },
                            legend: {
                                top: '5%',
                                left: 'center'
                            },
                            series: [
                                {
                                    name: '用户角色分布',
                                    type: 'pie',
                                    radius: ['40%', '70%'],
                                    avoidLabelOverlap: false,
                                    label: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        label: {
                                            show: true,
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    },
                                    labelLine: {
                                        show: false
                                    },
                                    data: this.pieChartData
                                }
                            ]
                        };
                        pieChart.setOption(option);
                    } else {
                        ElMessage.error(response.data.msg);
                    }
                })
              .catch((error) => {
                    ElMessage.error('获取用户数据失败，请检查网络或联系管理员');
                    console.error('Error fetching user data:', error);
                });
        },
        initLineChart() {
      axios.get('http://localhost:8080/Order/mapwatch')
     .then(response => {
          // 获取数据对象
          let data = response.data.data;
          // 将对象的键（日期）提取出来并排序
          let sortedKeys = Object.keys(data).sort();
          let sortedValues = [];
          for (let key of sortedKeys) {
            sortedValues.push(data[key]);
          }
          this.lineChartData = sortedValues;
          const lineChart = echarts.init(this.$refs.lineChartContainer);
          const option = {
            title: {
              text: '示例折线图'
            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: sortedKeys
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: this.lineChartData,
                type: 'line'
              }
            ]
          };
          lineChart.setOption(option);
        })
     .catch(error => {
          console.error('获取数据或初始化图表时出错:', error);
        });
    },
        initBarChart() {
            const barChart = echarts.init(this.$refs.barChartContainer);
            const option = {
                title: {
                    text: '示例柱状图'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '销量',
                        data: this.barChartData,
                        type: 'bar'
                    }
                ]
            };
            barChart.setOption(option);
        },
        async fetchData() {
            try {
                const response = await axios.get('/api/userInfo');
                this.user = response.data;
            } catch (error) {
                ElMessage.error('获取用户信息失败，请检查网络或联系管理员');
                console.error('Error fetching user info:', error);
            }
        }
    },
    mounted() {
        this.fetchData().then(() => {
            this.initPieChart();
            this.initLineChart();
            this.initBarChart();
        });
    },
    beforeUnmount() {
        if (this.$refs.pieChartContainer) {
            echarts.getInstanceByDom(this.$refs.pieChartContainer).dispose();
        }
        if (this.$refs.lineChartContainer) {
            echarts.getInstanceByDom(this.$refs.lineChartContainer).dispose();
        }
        if (this.$refs.barChartContainer) {
            echarts.getInstanceByDom(this.$refs.barChartContainer).dispose();
        }
    }
};
</script>

<style scoped lang="less">
.home {
    height: 100%;
    overflow: hidden;
.user {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin-right: 40px;
        }
    }
.login-info {
        margin-left: 20px;
    }
.chart-card {
        height: "100%";
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #ccc;
  .chart-title {
            text-align: center;
        }
    }
}
</style>
