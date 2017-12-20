/**
 * Created by wangquan on 2017/10/23.
 * 基础商品审核列表
 */
import { queryGoodsBrandNameList } from 'services/goods/goodsAudit';

export default {
    namespace: 'goodsAudit',
    state: {
        data: {
            dataSource: [],
            options: []
        },
        tableData: {
            goodsVerifyRecordList: []
        },
        dropData: {
            brandNameInfoList: []
        },
        categoryData: {
            list: []
        }
    },
    subscriptions: {

    },
    effects: {
        *getDropData({ payload }, { put, call, select }) {
            // 获取品牌管理下拉框数据
            const { code, message, data } = yield call(queryGoodsBrandNameList, payload);
            console.log(111111111);
            if (code !== 0 || !data) {
                throw message;
            } else {
                data.brandNameInfoList.unshift({
                    brandLogo: '',
                    chineseName: '全部',
                    foreignName: '全部',
                    id: 0
                });
                yield put({
                    type: 'updateDropData',
                    payload: data
                });
            }
        }
    },
    reducers: {
        updateDropData(state, { payload }) {
            return {
                ...state,
                dropData: payload
            };
        }
    }
};
