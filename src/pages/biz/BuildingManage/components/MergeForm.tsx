import React, { useEffect } from 'react';

import AMapLoader from '@amap/amap-jsapi-loader';
import { Modal } from 'antd';

// https://lbs.amap.com/demo/amap-ui/demos/amap-ui-poipicker/index
// https://lbs.amap.com/api/jsapi-v2/guide/abc/load

type MergeFormProps = {
  visible?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  value?: any;
  onSuccess?: () => void;
};

const MergeForm: React.FC<MergeFormProps> = (props) => {
  // const [map, setMap] = useState<any>();

  useEffect(() => {
    AMapLoader.load({
      key: '90b552931baba534997699d0286dd6af', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [
        'AMap.MoveAnimation',
        'AMap.MassMarks',
        'AMap.Geolocation',
        'AMap.CitySearch',
        'AMap.Geocoder',
      ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap) => {
        const a = new AMap.Map('container111', {
          //设置地图容器id
          viewMode: '3D', //是否为3D地图模式
          zoom: 7, //初始化地图级别
          center: [105.602725, 37.076636], //初始化地图中心点位置
        });
        console.log(a);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      <div id="container111" className="map" style={{ height: '800px' }} />
      <Modal
        width={640}
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        // destroyOnClose
        title="规则配置"
        visible={props.visible}
        // footer={submitter}
        onCancel={() => {
          props?.onCancel?.();
        }}
      >
        aa
      </Modal>
    </>
  );
};

export default MergeForm;
