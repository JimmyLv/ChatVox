import Link from 'next/link'
import React from 'react'
import { Icons } from '@/components/icons'

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
      <NavigationMenuList className="flex md:flex-row flex-col items-start">
        <NavigationMenuItem>
          <Link href="https://b.aitodo.co" legacyBehavior passHref target="_blank">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.copyright className="mr-1 h-4 w-4" />
              AITODO.CO
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="https://aitodo.canny.io/feature-requests" legacyBehavior passHref target="_blank">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.help className="mr-1 h-4 w-4" />
              Feedback
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="https://github.com/JimmyLv/ChatVox" legacyBehavior passHref target="_blank">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.star className="mr-1 h-4 w-4" />
              <span className="hidden md:block mr-1">Star on</span>GitHub
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
