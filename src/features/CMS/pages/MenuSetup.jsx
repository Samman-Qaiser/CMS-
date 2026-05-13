import Menu from "../components/Menu"
import MenuName from "../components/MenuName"
import MenuTypes from "../components/MenuTypes"
import ScreenOptions from "../components/ScreenOptions"

const MenuSetup = () => {
  return (
    <div>
        <ScreenOptions />
        <Menu />
        <div>
            <MenuTypes />
            <MenuName />
        </div>
        
    </div>
  )
}

export default MenuSetup