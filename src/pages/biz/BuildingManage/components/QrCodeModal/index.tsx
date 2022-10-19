import { Modal } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';

type QrCodeModalType = {
  value: any;
  open: boolean;
  onOk?: () => void;
  onCancel?: () => void;
};

const QrCodeModal: React.FC<QrCodeModalType> = (props) => {
  const { value } = props;

  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    // console.log('vvvv', value);
    const qrCodeUrl = `https://qc.hzex7.com/pagesStore/takeFood/takeFood?areaId=${value?.id}`;
    setUrl(qrCodeUrl);
  }, [value?.id]);

  return (
    <>
      <Modal
        title={'【' + value?.areaName + '】取餐码'}
        visible={props.open}
        onOk={props.onOk}
        // confirmLoading={confirmLoading}
        onCancel={props.onCancel}
      >
        <QRCodeCanvas
          size={256}
          value={url}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          includeMargin={false}
          imageSettings={{ src: '/logo.png', height: 64, width: 64, excavate: true }}
        />
      </Modal>
    </>
  );
};

export default QrCodeModal;
