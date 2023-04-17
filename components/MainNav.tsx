import Link from 'next/link'
import React from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu'

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="https://b.aitodo.co" legacyBehavior passHref target="_blank">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              © AITODO.CO
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="https://github.com/JimmyLv/ChatVox" legacyBehavior passHref target="_blank">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              ⭐️ Star on GitHub
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
