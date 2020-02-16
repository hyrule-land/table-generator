import styles from './index.css';

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>将语雀上富文本编辑器里面的 table 代码转换成符合 jsx 规范的代码编辑器里面的 table 代码转换成符合 jsx 规范的代码!</h1>
      {props.children}
    </div>
  );
}

export default BasicLayout;
