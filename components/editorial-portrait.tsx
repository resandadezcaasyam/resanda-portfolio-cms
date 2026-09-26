import Image from 'next/image';

const portraits = {
  seated: {src:'/images/resanda-seated.png',width:1177,height:1337,alt:'Resanda seated with his hands resting on his knees',label:'A LITTLE ABOUT ME',caption:'Resanda Dezca Asyam'},
  contact: {src:'/images/resanda-seated.png',width:1177,height:1337,alt:'Resanda seated with his hands resting on his knees',label:'AN OPEN CONVERSATION',caption:'Let’s make something good.'},
  marker: {src:'/images/resanda-marker.png',width:1125,height:1398,alt:'Resanda holding a marker and looking to the side',label:'PEOPLE, IDEAS & DELIVERY',caption:'Turning questions into clarity.'},
};

export function EditorialPortrait({variant}:{variant:keyof typeof portraits}){
  const photo=portraits[variant];
  return <figure className={'editorial-portrait photo-'+variant} data-tilt>
    <div className="editorial-photo-stage">
      <span className="photo-disc" aria-hidden="true"/>
      <span className="photo-lines" aria-hidden="true"/>
      <span className="photo-spark" aria-hidden="true">✦</span>
      <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 760px) 90vw, 450px"/>
    </div>
    <figcaption><small>{photo.label}</small><b>{photo.caption}</b></figcaption>
  </figure>;
}
