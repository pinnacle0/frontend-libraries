export interface ProvinceCityItem {
    province: string;
    cities: string[];
}

export const ProvinceCityList: ReadonlyArray<ProvinceCityItem> = [
    {
        province: "北京",
        cities: [
            "东城区",
            "西城区",
            "崇文区",
            "宣武区",
            "朝阳区",
            "丰台区",
            "石景山区",
            "海淀区",
            "门头沟区",
            "房山区",
            "通州区",
            "顺义区",
            "昌平区",
            "大兴区",
            "平谷区",
            "怀柔区",
            "密云县",
            "延庆县",
        ],
    },
    {
        province: "天津",
        cities: ["和平区", "河东区", "河西区", "南开区", "河北区", "红桥区", "塘沽区", "汉沽区", "大港区", "东丽区", "西青区", "津南区", "北辰区", "武清区", "宝坻区", "宁河县", "静海县", "蓟 县"],
    },
    {province: "河北", cities: ["石家庄", "唐山", "秦皇岛", "邯郸", "邢台", "保定", "张家口", "承德", "沧州", "廊坊", "衡水"]},
    {province: "山西", cities: ["太原", "大同", "阳泉", "长治", "晋城", "朔州", "忻州", "吕梁", "晋中", "临汾", "运城"]},
    {province: "内蒙古", cities: ["呼和浩特", "包头", "乌海", "赤峰", "呼伦贝尔", "兴安盟", "通辽", "锡林郭勒盟", "乌兰察布盟", "伊克昭盟", "巴彦淖尔盟", "阿拉善盟"]},
    {province: "辽宁", cities: ["沈阳", "大连", "鞍山", "抚顺", "本溪", "丹东", "锦州", "营口", "阜新", "辽阳", "盘锦", "铁岭", "朝阳", "葫芦岛", "其他"]},
    {province: "吉林", cities: ["长春", "吉林", "四平", "辽源", "通化", "白山", "松原", "白城", "延边朝鲜族自治州", "其他"]},
    {province: "黑龙江", cities: ["哈尔滨", "齐齐哈尔", "鹤岗", "双鸭山", "鸡西", "大庆", "伊春", "牡丹江", "佳木斯", "七台河", "黑河", "绥化", "大兴安岭地区", "其他"]},
    {
        province: "上海",
        cities: [
            "黄浦区",
            "卢湾区",
            "徐汇区",
            "长宁区",
            "静安区",
            "普陀区",
            "闸北区",
            "虹口区",
            "杨浦区",
            "宝山区",
            "闵行区",
            "嘉定区",
            "松江区",
            "金山区",
            "青浦区",
            "南汇区",
            "奉贤区",
            "浦东新区",
            "崇明县",
            "其他",
        ],
    },
    {province: "江苏", cities: ["南京", "苏州", "无锡", "常州", "镇江", "南通", "泰州", "扬州", "盐城", "连云港", "徐州", "淮安", "宿迁", "其他"]},
    {province: "浙江", cities: ["杭州", "宁波", "温州", "嘉兴", "湖州", "绍兴", "金华", "衢州", "舟山", "台州", "丽水", "其他"]},
    {province: "安徽", cities: ["合肥", "芜湖", "蚌埠", "淮南", "马鞍山", "淮北", "铜陵", "安庆", "黄山", "滁州", "阜阳", "宿州", "巢湖", "六安", "亳州", "池州", "宣城", "其他"]},
    {province: "福建", cities: ["福州", "厦门", "莆田", "三明", "泉州", "漳州", "南平", "龙岩", "宁德", "其他"]},
    {province: "江西", cities: ["南昌", "景德镇", "萍乡", "九江", "新余", "鹰潭", "赣州", "吉安", "宜春", "抚州", "上饶", "其他"]},
    {province: "山东", cities: ["济南", "青岛", "淄博", "枣庄", "东营", "烟台", "潍坊", "济宁", "泰安", "威海", "日照", "莱芜", "临沂", "德州", "聊城", "滨州", "菏泽", "其他"]},
    {province: "河南", cities: ["郑州", "开封", "洛阳", "平顶山", "安阳", "鹤壁", "新乡", "焦作", "濮阳", "许昌", "漯河", "三门峡", "南阳", "商丘", "信阳", "周口", "驻马店", "焦作", "其他"]},
    {
        province: "湖北",
        cities: ["武汉", "黄石", "十堰", "荆州", "宜昌", "襄樊", "鄂州", "荆门", "孝感", "黄冈", "咸宁", "随州", "恩施土家族苗族自治州", "仙桃", "天门", "潜江", "神农架林区", "其他"],
    },
    {province: "湖南", cities: ["长沙", "株洲", "湘潭", "衡阳", "邵阳", "岳阳", "常德", "张家界", "益阳", "郴州", "永州", "怀化", "娄底", "湘西土家族苗族自治州", "其他"]},
    {
        province: "广东",
        cities: ["广州", "深圳", "东莞", "中山", "潮州", "揭阳", "云浮", "珠海", "汕头", "韶关", "佛山", "江门", "湛江", "茂名", "肇庆", "惠州", "梅州", "汕尾", "河源", "阳江", "清远"],
    },
    {province: "广西", cities: ["南宁", "柳州", "桂林", "梧州", "北海", "防城港", "钦州", "贵港", "玉林", "百色", "贺州", "河池", "来宾", "崇左", "其他"]},
    {
        province: "海南",
        cities: [
            "海口",
            "三亚",
            "五指山",
            "琼海",
            "儋州",
            "文昌",
            "万宁",
            "东方",
            "澄迈县",
            "定安县",
            "屯昌县",
            "临高县",
            "白沙黎族自治县",
            "昌江黎族自治县",
            "乐东黎族自治县",
            "陵水黎族自治县",
            "保亭黎族苗族自治县",
            "琼中黎族苗族自治县",
            "其他",
        ],
    },
    {
        province: "重庆",
        cities: [
            "渝中区",
            "大渡口区",
            "江北区",
            "南岸区",
            "北碚区",
            "渝北区",
            "巴南区",
            "长寿区",
            "双桥区",
            "沙坪坝区",
            "万盛区",
            "万州区",
            "涪陵区",
            "黔江区",
            "永川区",
            "合川区",
            "江津区",
            "九龙坡区",
            "南川区",
            "綦江县",
            "潼南县",
            "荣昌县",
            "璧山县",
            "大足县",
            "铜梁县",
            "梁平县",
            "开县",
            "忠县",
            "城口县",
            "垫江县",
            "武隆县",
            "丰都县",
            "奉节县",
            "云阳县",
            "巫溪县",
            "巫山县",
            "石柱土家族自治县",
            "秀山土家族苗族自治县",
            "酉阳土家族苗族自治县",
            "彭水苗族土家族自治县",
            "其他",
        ],
    },
    {
        province: "四川",
        cities: [
            "成都",
            "自贡",
            "攀枝花",
            "泸州",
            "德阳",
            "绵阳",
            "广元",
            "遂宁",
            "内江",
            "乐山",
            "南充",
            "眉山",
            "宜宾",
            "广安",
            "达州",
            "雅安",
            "巴中",
            "资阳",
            "阿坝藏族羌族自治州",
            "甘孜藏族自治州",
            "凉山彝族自治州",
            "其他",
        ],
    },
    {province: "贵州", cities: ["贵阳", "六盘水", "遵义", "安顺", "铜仁地区", "毕节地区", "黔西南布依族苗族自治州", "黔东南苗族侗族自治州", "黔南布依族苗族自治州", "其他"]},
    {
        province: "云南",
        cities: [
            "昆明",
            "曲靖",
            "玉溪",
            "保山",
            "昭通",
            "丽江",
            "普洱",
            "临沧",
            "德宏傣族景颇族自治州",
            "怒江傈僳族自治州",
            "迪庆藏族自治州",
            "大理白族自治州",
            "楚雄彝族自治州",
            "红河哈尼族彝族自治州",
            "文山壮族苗族自治州",
            "西双版纳傣族自治州",
            "其他",
        ],
    },
    {province: "西藏", cities: ["拉萨", "那曲地区", "昌都地区", "林芝地区", "山南地区", "日喀则地区", "阿里地区", "其他"]},
    {province: "陕西", cities: ["西安", "铜川", "宝鸡", "咸阳", "渭南", "延安", "汉中", "榆林", "安康", "商洛", "其他"]},
    {province: "甘肃", cities: ["兰州", "嘉峪关", "金昌", "白银", "天水", "武威", "酒泉", "张掖", "庆阳", "平凉", "定西", "陇南", "临夏回族自治州", "甘南藏族自治州", "其他"]},
    {province: "青海", cities: ["西宁", "海东地区", "海北藏族自治州", "海南藏族自治州", "黄南藏族自治州", "果洛藏族自治州", "玉树藏族自治州", "海西蒙古族藏族自治州", "其他"]},
    {province: "宁夏", cities: ["银川", "石嘴山", "吴忠", "固原", "中卫", "其他"]},
    {
        province: "新疆",
        cities: [
            "乌鲁木齐",
            "克拉玛依",
            "吐鲁番地区",
            "哈密地区",
            "和田地区",
            "阿克苏地区",
            "喀什地区",
            "克孜勒苏柯尔克孜自治州",
            "巴音郭楞蒙古自治州",
            "昌吉回族自治州",
            "博尔塔拉蒙古自治州",
            "石河子",
            "阿拉尔",
            "图木舒克",
            "五家渠",
            "伊犁哈萨克自治州",
            "其他",
        ],
    },
];
