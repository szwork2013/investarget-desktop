import React from 'react'
import { Input, Select, Icon, Button } from 'antd'
import { FormattedMessage } from 'react-intl'

const Option = Select.Option

class Search extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      key: props.keys[0] && props.keys[0].value
    }
    this.onKeyChange = this.onKeyChange.bind(this)
  }

  onKeyChange(value) {
    this.setState({ key: value })
  }

  onValueChange(key, e) {
    const value = e.target.value
    if (this.props.onChange) {
      this.props.onChange(key, value)
    }
  }

  render() {
    const defaultSearchKey = this.props.keys[0] && this.props.keys[0].value
    const selectBefore = (
      <Select defaultValue={defaultSearchKey} style={{ minWidth: 80 }} onChange={this.onKeyChange}>
        {
          this.props.keys.map(item =>
            <Option key={item.value} value={item.value}>{item.label}</Option>
          )
        }
      </Select>
    )

    return (
      <Input.Search
        style={{ width: 200 }}
        placeholder=""
        addonBefore={selectBefore}
        onChange={this.onValueChange.bind(this, this.state.key)}
        onSearch={this.props.onSearch.bind(this, this.state.key)} />
    )
  }
}

export default Search
