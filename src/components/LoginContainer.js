
const containerStyle = {background:'#fff'}
const headerStyle = {width: 1200, height: 80, margin: '0 auto', backgroundColor: '#fff'}
const logoStyle = {height: 70, padding: '10px 0'}
const bodyWrapStyle = {margin: '0 auto', minWidth: 1200,maxWidth: 1920, height: 750, backgroundImage: 'url(/images/background.jpg)', backgroundPosition: 'center center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}
const bodyStyle = {width: 1200, height: '100%', margin: '0 auto', position: 'relative'}
const footerStyle = {width: 1200, height: 100, margin: '0 auto', backgroundColor: '#fff'}
const copyrightStyle = {textAlign:'center',height:20,lineHeight:'20px',paddingTop:40,fontSize:16,color:'#989898'}

function LoginContainer(props) {
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <img src="/images/logo.jpg" style={logoStyle} />
      </div>
      <div style={bodyWrapStyle}>
        <div style={bodyStyle}>
          {props.children}
        </div>
      </div>
      <div style={footerStyle}>
        <p style={copyrightStyle}>
          &copy; 2017.All Rights Reserved. Investarget
        </p>
      </div>
    </div>
  )
}

export default LoginContainer
