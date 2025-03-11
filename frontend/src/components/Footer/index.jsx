import style from './Footer.module.css'
import logoEstadoPE from '../../assets/LogoGovPE.png'

const Footer = () =>  {
  return (
    <div className={style.containerFooter}>
      <img src={logoEstadoPE} alt="logo do governo de Pernambuco" />
    </div>
  );
}

export default Footer;