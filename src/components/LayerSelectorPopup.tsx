import React from 'react';
import _ from 'lodash';
import {useWindowSize} from '../helpers/hooks'
import {SingleObject} from '../reducer'

interface Props {

  handleClose: () => void
  handleClick: (clicked: SingleObject) => void
  options: {
    x: number,
    y: number,
    values: Array<SingleObject>
  }
}
const Popup:React.FC<Props> = ({handleClose,handleClick,options}) => {
  const windowSize = useWindowSize();
  const [divSize, setDivSize] = React.useState<{width:number, height:number}>(undefined)//used to be yMenu
  const wrapper = React.useRef<HTMLDivElement>(null);//this.div.clientHeight

  React.useEffect(() => {
    if (!wrapper) return
    if(!divSize || divSize.height !== wrapper.current.clientHeight || divSize.width !== wrapper.current.clientWidth){
        setDivSize({
          height: wrapper.current.clientHeight,
          width: wrapper.current.clientWidth
        })
    }
  }, [divSize, wrapper])



  let style:React.CSSProperties = {}
  //als er is geklikt
  if (options) {
      //kijk wat de geklikte coordinaten zijn op het scherm
      let top = options.y;
      let left = options.x;

      //kijk of de component zal passen op het scherm
      if ((windowSize.width - left) < divSize.width) {
          //anders verplaats het naar link totdat het wel pasts
          left = windowSize.width - divSize.width;
      }

      //zelfde met hoogte
      if ((windowSize.height - top) < divSize.height) {
          top = windowSize.height - divSize.height;
      }

      // - 10 zodat de gebruiker altijd over de component heen hovert als deze geopend wordt
      style = {
          position: 'absolute',
          top: `${top - 10}px`,
          left: `${left - 10}px`,
          display: "block",
      };
  } else {
      //als iemand niet heeft geklikt laat deze component weg
      style = {
          display: "none",
      };
  }


  return (<div style={style}
               className="contextMenuContainer"
               ref={wrapper}
               onMouseLeave={handleClose}
               onContextMenu={(e) => {
                   e.preventDefault();
               }}>
      {options?.values.map(res => {
          return (<div key={res.shapeTooltip + res.shapeColor} onClick={() => {
            handleClick(res);
          }}>
              <b>{res.shapeTooltip} </b>

          </div>);
      })}
  </div>)
}








export default Popup
