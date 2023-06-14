const switchMenu = () => {
  let scale_val = 0
  const switch_ = () => {
    console.log(scale_val);
    if (scale_val === 0) {
      scale_val = 1
    } else {
      scale_val = 0
    }
    doms.switch.style.transform = `scale(${scale_val})`
  }
  return switch_
}

const switch_ = switchMenu()

doms.i.addEventListener('click', switch_)