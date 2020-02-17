import BasicLayout from '..';
import renderer from 'react-test-renderer';

describe('Layout: BasicLayout', () => {
  it('Render correctly', () => {
    const wrapper = renderer.create(<BasicLayout />);
    expect(wrapper.root.children.length).toBe(1);
    const outerLayer = wrapper.root.children[0];
    expect(outerLayer.type).toBe('div');
    const title = outerLayer.children[0];
    expect(title.type).toBe('h1');
    expect(title.children[0]).toBe('将语雀上富文本编辑器里面的 table 代码转换成符合 jsx 规范的代码');
  });
});
