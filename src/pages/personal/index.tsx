import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Personal () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='personal'>
      <Text>Hello world!</Text>
    </View>
  )
}
