export const mmcRadar: UrlTemplate[] = [
  {
    name: "全国",
    interval: 6 * 60 * 1000,
    delay: 6 * 60 * 1000 * 2,
    width: 1349,
    height: 1208,
    url: "http://image.nmc.cn/product/${UTC_YEAR}/${UTC_MONTH}/${UTC_DATE}/RDCP/SEVP_AOC_RDCP_SLDAS3_ECREF_ACHN_L88_PI_${UTC_YEAR}${UTC_MONTH}${UTC_DATE}${UTC_HOUR}${UTC_MINUTE}00000.PNG",
    offset: 0,
  },
  {
    name: "华南",
    interval: 6 * 60 * 1000,
    delay: 6 * 60 * 1000 * 2,
    width: 990,
    height: 959,
    url: "http://image.nmc.cn/product/${UTC_YEAR}/${UTC_MONTH}/${UTC_DATE}/RDCP/SEVP_AOC_RDCP_SLDAS3_ECREF_ASCN_L88_PI_${UTC_YEAR}${UTC_MONTH}${UTC_DATE}${UTC_HOUR}${UTC_MINUTE}00000.PNG",
    offset: 0,
  },
  {
    name: "华北",
    interval: 6 * 60 * 1000,
    delay: 6 * 60 * 1000 * 2,
    width: 954,
    height: 949,
    url: "http://image.nmc.cn/product/${UTC_YEAR}/${UTC_MONTH}/${UTC_DATE}/RDCP/SEVP_AOC_RDCP_SLDAS3_ECREF_ANCN_L88_PI_${UTC_YEAR}${UTC_MONTH}${UTC_DATE}${UTC_HOUR}${UTC_MINUTE}00000.PNG",
    offset: 0,
  },
  {
    name: "华东",
    interval: 6 * 60 * 1000,
    delay: 6 * 60 * 1000 * 2,
    width: 774,
    height: 1326,
    url: "http://image.nmc.cn/product/${UTC_YEAR}/${UTC_MONTH}/${UTC_DATE}/RDCP/SEVP_AOC_RDCP_SLDAS3_ECREF_AECN_L88_PI_${UTC_YEAR}${UTC_MONTH}${UTC_DATE}${UTC_HOUR}${UTC_MINUTE}00000.PNG",
    offset: 0,
  },
  {
    name: "东北",
    interval: 6 * 60 * 1000,
    delay: 6 * 60 * 1000 * 2,
    width: 936,
    height: 983,
    url: "http://image.nmc.cn/product/${UTC_YEAR}/${UTC_MONTH}/${UTC_DATE}/RDCP/SEVP_AOC_RDCP_SLDAS3_ECREF_ANEC_L88_PI_${UTC_YEAR}${UTC_MONTH}${UTC_DATE}${UTC_HOUR}${UTC_MINUTE}00000.PNG",
    offset: 0,
  },
  {
    name: "华中",
    interval: 6 * 60 * 1000,
    delay: 6 * 60 * 1000 * 2,
    width: 975,
    height: 980,
    url: "http://image.nmc.cn/product/${UTC_YEAR}/${UTC_MONTH}/${UTC_DATE}/RDCP/SEVP_AOC_RDCP_SLDAS3_ECREF_ACCN_L88_PI_${UTC_YEAR}${UTC_MONTH}${UTC_DATE}${UTC_HOUR}${UTC_MINUTE}00000.PNG",
    offset: 0,
  },
  {
    name: "西南",
    interval: 6 * 60 * 1000,
    delay: 6 * 60 * 1000 * 2,
    width: 971,
    height: 818,
    url: "http://image.nmc.cn/product/${UTC_YEAR}/${UTC_MONTH}/${UTC_DATE}/RDCP/SEVP_AOC_RDCP_SLDAS3_ECREF_ASWC_L88_PI_${UTC_YEAR}${UTC_MONTH}${UTC_DATE}${UTC_HOUR}${UTC_MINUTE}00000.PNG",
    offset: 0,
  },
  {
    name: "西北",
    interval: 6 * 60 * 1000,
    delay: 6 * 60 * 1000 * 2,
    width: 971,
    height: 818,
    url: "http://image.nmc.cn/product/${UTC_YEAR}/${UTC_MONTH}/${UTC_DATE}/RDCP/SEVP_AOC_RDCP_SLDAS3_ECREF_ANWC_L88_PI_${UTC_YEAR}${UTC_MONTH}${UTC_DATE}${UTC_HOUR}${UTC_MINUTE}00000.PNG",
    offset: 0,
  },
];
