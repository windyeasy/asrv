import Mock from '@wll8/better-mock'

export const mock = Mock.mock

export {
  Mock,
}

interface MockString {
  (rurl: string | RegExp, rtype: string, template: ((options: Mock.MockCbOptions) => any) | any): string

  (rurl: string | RegExp, template: ((options: Mock.MockCbOptions) => any) | any): string

  (template: any): string
}

/***
 * 结合Mock和JSON.stringify将生成的数据转为字符串
 * @returns 返回生成mock后生成的字符串
 */
export const mockString: MockString = (...args: any[]) => {
  if (args.length === 3) {
    return JSON.stringify(mock(args[0], args[1], args[2]))
  }
  else if (args.length === 2) {
    return JSON.stringify(mock(args[0], args[1]))
  }
  else {
    return JSON.stringify(mock(args[0]))
  }
}
