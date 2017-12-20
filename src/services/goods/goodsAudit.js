/**
 * Created by admin on 2017/10/24.
 * 基础商品审核完成
 */
import { request } from 'utils';

// 查询品牌中文\外文名(下拉框)
export async function queryGoodsBrandNameList() {
    return request({
        url: '/brand/queryGoodsBrandNameList',
        method: 'GET'
    });
}
