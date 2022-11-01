import { QrcodeOutlined } from '@ant-design/icons';
import { Card, Col, Popover, Row } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';

const QrcodePopover: React.FC<any> = () => {
  const content = (
    <div style={{ padding: '10px', background: '#ececec' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="配送端APP下载" bordered={false}>
            <QRCodeCanvas
              key="delivery"
              size={256}
              value="https://www.hzex7.com/h5/#/pages/app-download/delivery?t=2"
              bgColor={'#ffffff'}
              fgColor={'#000000'}
              level={'H'}
              includeMargin={false}
              imageSettings={{ src: '/delivery_logo.jpg', height: 64, width: 64, excavate: true }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="厨房端APP下载" bordered={false}>
            <QRCodeCanvas
              key="kitchen"
              size={256}
              value="https://www.hzex7.com/h5/#/pages/app-download/kitchen?t=1"
              bgColor={'#ffffff'}
              fgColor={'#000000'}
              level={'H'}
              includeMargin={false}
              imageSettings={{ src: '/kitchen_logo.jpg', height: 64, width: 64, excavate: true }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <>
      <Popover placement="bottomRight" title="APP下载" content={content}>
        <QrcodeOutlined />
      </Popover>
    </>
  );
};

export default QrcodePopover;
