import React, { useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import styles from './MyAmap.less';

// https://lbs.amap.com/demo/amap-ui/demos/amap-ui-poipicker/index
// https://lbs.amap.com/api/jsapi-v2/guide/abc/load

type MergeFormProps = {
  value?: any;
  onChange?: () => void;
};

const MyAmap: React.FC<MergeFormProps> = () => {
  // const [map, setMap] = useState<any>();

  useEffect(() => {
    let mapInstance: any;
    AMapLoader.load({
      key: 'c20bbe471f149ae4b53d9769d3603d88',
      // key: '90b552931baba534997699d0286dd6af', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.ToolBar', 'AMap.Marker'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      AMapUI: {
        // version: '1.1', // AMapUI 缺省 1.1
        plugins: ['misc/PoiPicker'], // 需要加载的 AMapUI ui插件
      },
    })
      .then((AMap) => {
        mapInstance = new AMap.Map('container-amap', {
          //设置地图容器id
          viewMode: '3D', //是否为3D地图模式
          zoom: 17, //初始化地图级别
          center: [120.255306, 30.237285], //初始化地图中心点位置
        });
        const marker = new AMap.Marker();

        console.log('map => ', mapInstance);
        mapInstance.addControl(new AMap.ToolBar());
        const poiPicker = new AMapUI.PoiPicker({
          input: 'pickerInput',
        });
        poiPicker.on('poiPicked', (res: any) => {
          console.log('res=>  ', res);
          marker.setMap(mapInstance);
          marker.setPosition(res.item.location);
          mapInstance.setCenter(marker.getPosition());
          console.log('pos ', marker.getPosition());
        });
        console.log('poiPicker => ', poiPicker);
      })
      .catch((e) => {
        console.log('error => ', e);
      });

    // return () => {
    //   console.log('destroy amap.');
    //   mapInstance.destroy();
    // };
  }, []);

  return (
    <>
      <div
        id="container-amap"
        className={styles.container}
        tabIndex={0}
        style={{ height: '400px' }}
      />
      <div id="pickerBox" className={styles.pickerBox}>
        <input
          id="pickerInput"
          className={styles.pickerInput}
          placeholder="输入关键字搜索"
          autoComplete="off"
        />
        <div id="poiInfo" className={styles.poiInfo} />
      </div>
    </>
  );
};

export default MyAmap;
