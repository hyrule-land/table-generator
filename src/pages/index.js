import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Button, Row, Col } from 'antd';
import parse from 'html-react-parser';

import styles from './index.less';
import './lakeTable.less'

const { TextArea } = Input;

// 将连字符 - 转换成驼峰写法
function toCamelCase(str){
  const reg = /(-)(\w)/g;
  return str.replace(reg, function($0, $1,$2){
    return $2.toUpperCase();
  });
}

// 转换方法
function convertHtml(html) {
  // 转换 <br> 为 <br/>
  const nextHtml1 = html.replace(/(<br>)/g, '<br/>');
  // 将 <col> 标签闭合
  const nextHtml2 = nextHtml1.replace(/(<col width=")(.*?)(>)/g, '<col width="$2' + '/>');

  // 将 class 转变成 className
  const nextHtml3 = nextHtml2.replace(/class="/g, 'className="');

  // 将字符串写法的 style 标签转换成 对象 的写法（jsx规范）
  const reg4 = /(style=")(.*?)(")/g;
  const nextHtml4 = nextHtml3.replace(reg4, function(word) {
    let styleObject = {};

    const styles = word
      .substring(7, word.length -1)
      .split(';')
      .filter(item => {
        return item.length > 0 && item.includes(':')
      });
    styles.forEach(style => {
      const [name, value] = style.split(':');
      const nextName = toCamelCase(name.trim());
      styleObject[nextName] = value.trim()
    });
    return `style={${JSON.stringify(styleObject)}}`;
  });

  const reg5 = /(bind:data)(.*?)(<\/td>)/g;
  const nextHtml5 = nextHtml4.replace(reg5, function(word) {
    const path = word.substring(9, word.length - 5);
    const tdTag = '<\/td>';
    return `{_get(data, '${path}')}${tdTag}`;
  })

  return nextHtml5;
}

export default class Index extends Component {
  state = {
    targetHtml: ''
  }

  onTextAreaChange = e => {
    const { value } = e.target;
    const targetHtml = convertHtml(value);
    this.setState({
      targetHtml,
    })

    const div = document.createElement("div");
    div.innerHTML = targetHtml;

    const Preview = (parse(targetHtml));

    ReactDOM.render(Preview, document.getElementById('preview'));
  }

  render() {
    const { targetHtml } = this.state;
    return (
      <div style={{ padding: 20 }}>
        <Row gutter={20}>
          <Col span={12}>
            <div style={{
              fontSize: 16,
              textAlign: 'left',
              marginBottom: 10,
              color: 'red'
            }}>
              请将语雀上表格部分的 html 代码粘贴在这里（table标签那部分的代码）：
            </div>

            <TextArea rows={10} onChange={this.onTextAreaChange} />
          </Col>
          <Col span={12}>
            <div style={{
              fontSize: 16,
              textAlign: 'left',
              marginBottom: 10,
              color: 'red'
            }}>
              转换后的代码：
            </div>
            <TextArea rows={10} value={targetHtml} readOnly={true} />
          </Col>
        </Row>

        <div className={styles.content}>
          <div className={styles.yhsTable}>
            <div style={{
              fontSize: 16,
              textAlign: 'left',
              marginBottom: 10,
              color: 'red'
            }}>
              预览：
            </div>

            <div id="preview" />
          </div>
        </div>

      </div>
    );
  }
}
