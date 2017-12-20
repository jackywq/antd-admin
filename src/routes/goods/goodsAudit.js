// eg: 基本的页面结构
import React from 'react';
import { connect } from 'dva';
import { Page, Form } from 'components';
// import styles from './add.less';

class GoodsAudit extends React.Component {
    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
    }
    componentWillMount = () => {
        this.dispatch({
            type: 'goodsAudit/getDropData'      // 初始化品牌下拉菜单数据
        });
    }
    render() {
        return (
            <div>商品审核</div>
        );
    }
}

export default connect(({ goodsAudit }) => ({ goodsAudit }))(GoodsAudit);
