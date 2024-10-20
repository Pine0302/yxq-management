import { Modal } from 'antd';

const CouponInfoModal = ({ visible, onClose, couponInfo }) => (
  <Modal title="优惠券信息" visible={visible} onCancel={onClose} footer={null}>
    {couponInfo && (
      <>
        <p>商品价格: {couponInfo.originalPrice}</p>
        <p>共计优惠: {couponInfo.couponPrice}</p>
        <p>优惠券名称: {couponInfo.couponName}</p>
        <p>
          满减条件: 满 {couponInfo.payFull} 元减 {couponInfo.reduce} 元
        </p>
        <p>
          有效期: {new Date(couponInfo.startTime).toLocaleDateString()} 至{' '}
          {new Date(couponInfo.endTime).toLocaleDateString()}
        </p>
        <p>备注: {couponInfo.discountRemark}</p>
      </>
    )}
  </Modal>
);

export default CouponInfoModal;
