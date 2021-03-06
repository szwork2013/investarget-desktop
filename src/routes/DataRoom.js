import React from 'react'
import { connect } from 'dva'
import LeftRightLayout from '../components/LeftRightLayout'
import FileMgmt from '../components/FileMgmt'
import * as api from '../api'
import { Modal } from 'antd'
import { hasPerm, isLogin, i18n, handleError } from '../utils/util'
import DataRoomUser from '../components/DataRoomUser'

class DataRoom extends React.Component {

  constructor(props) {
    super(props)

    const { id, isClose, projectID, projectTitle } = props.location.query
    this.state = {
      id: id,
      isClose: isClose == 'true' ? true : false,
      title: decodeURIComponent(projectTitle),
      data: [],
      visible: false,

      userOptions: [],
      userDataroomIds: [],
      fileUserList: [],

      list: [],
      newUser: null,

      selectedUser: null,
      targetUserFileList: [],
    }
  }

  componentDidMount() {
    this.getDataRoomFile()
    this.getAllUserFile()
  }

  formatData = (data) => {
    return data.map(item => {
      const parentId = item.parent || -999
      const name = item.filename
      const rename = item.filename
      const unique = item.id
      const isFolder = !item.isFile
      const date = item.lastmodifytime || item.createdtime
      const timezone = item.timezone || '+08:00'
      return { ...item, parentId, name, rename, unique, isFolder, date, timezone }
    })
  }

  getDataRoomFile = () => {
    const id = this.state.id
    if (hasPerm('usersys.as_admin')) {
      let param = { dataroom: id }
      api.queryDataRoomFile(param).then(result => {
        var { count, data } = result.data
        data = this.formatData(data)
        this.setState({ data })
      }).catch(error => {
        handleError(error)
      })
    } else {
      let currentUser = isLogin().id
      api.queryDataRoomDir(id).then(result => {
        this.setState({ data: this.formatData(result.data) })
        const param = { dataroom: id }
        return api.queryUserDataRoom(param).then(result => {
          const data = result.data.data[0]
          return api.queryUserDataRoomFile(data.id).then(result => {
            const files = result.data.files
            const data = [...this.state.data, ...files]
            this.setState({ data: this.formatData(data) })
          })
        })
      }).catch(error => {
        handleError(error)
      })
    }
  }

  getAllUserFile = () => {
    api.queryUserDataRoom({ dataroom: this.state.id }).then(result => {
      const list = result.data.data
      const users = list.map(item => item.user)
      const userIds = users.map(item => item.id)
      const userDataroomIds = list.map(item => item.id)
      var userDataroomMap = {}
      userIds.forEach((userId, index) => {
        userDataroomMap[userId] = userDataroomIds[index]
      })
      const userOptions = users.map(item => ({ label: item.username, value: item.id }))
      this.setState({ list, userOptions, userDataroomIds, userDataroomMap })
      if (this.state.selectedUser && !userIds.includes(this.state.selectedUser)) {
        this.setState({ selectedUser: null })
      }

      return Promise.all(list.map(item => {
        return api.queryUserDataRoomFile(item.id).then(result => {
          const { files, user } = result.data
          return files.map(item => {
            return { file: item.id, user }
          })
        })
      })).
      then(results => {
        const list = results.reduce((a,b) => a.concat(b), [])
        this.setState({ fileUserList: list })
        if (this.state.selectedUser) {
          let _list = list.filter(item => item.user == this.state.selectedUser)
          this.setState({ targetUserFileList: _list })
        }
      })

    }).catch(error => {
      handleError(error)
    })
  }

  handleCreateNewFolder(parentId) {
    const newData = this.state.data.slice()
    const existKeyList = newData.map(m => m.unique)
    const maxKey = Math.max(...existKeyList)

    newData.splice(0, 0, {
      name: i18n('dataroom.new_folder'),
      isFolder: true,
      parentId: parentId,
      rename: i18n('dataroom.new_folder'),
      unique: maxKey + 1,
    })
    this.setState({ data: newData, name: i18n('dataroom.new_folder') })
  }

  showModal = () => {
    this.setState({ visible: true })
  }
  hideModal = () => {
    this.setState({ visible: false, newUser: null })
  }

  handleNewFolderNameChange(unique, evt) {
    const newData = this.state.data.slice()
    const index = newData.map(m => m.unique).indexOf(unique)
    if (index > -1) {
      newData[index].rename = evt.target.value
      this.setState({ data: newData })
    }
  }

  handleConfirm(unique) {
    const newData = this.state.data.slice()
    const index = newData.map(m => m.unique).indexOf(unique)
    if (index < 0) return
    const value = this.state.data[index]
    if (!value.id) {
      // Create new folder
      const parentIndex = newData.map(m => m.id).indexOf(value.parentId)
      if (parentIndex < 0) return
      const dataroom = newData[parentIndex].dataroom
      const body = {
        dataroom: dataroom,
        filename: value.rename,
        isFile: false,
        orderNO: 1,
        parent: value.parentId == -999 ? null : value.parentId
      }

      newData.splice(index, 1)

      api.addDataRoomFile(body).then(data => {
        const item = data.data
        const parentId = item.parent || -999
        const name = item.filename
        const rename = item.filename
        const unique = item.id
        const isFolder = !item.isFile
        const date = item.lastmodifytime || item.createdtime
        const newItem = { ...item, parentId, name, rename, unique, isFolder, date }
        newData.push(newItem)
        this.setState({ data: newData })
      }).catch(error => {
        this.props.dispatch({
          type: 'app/findError',
          payload: error
        })
      })
    } else {
      // Rename
      const body = {
        id: value.id,
        filename: value.rename
      }
      api.editDataRoomFile(body).then(data => {
        newData[index].name = newData[index].rename
        this.setState({ data: newData })
      }).catch(error => {
        this.props.dispatch({
          type: 'app/findError',
          payload: error
        })
      })
    }
  }

  handleCancel(unique) {
    const newData = this.state.data.slice()
    const index = newData.map(m => m.unique).indexOf(unique)
    if (index < 0) return
    const value = newData[index]
    const name = value.name
    if (!value.id) {
      newData.splice(index, 1)
      this.setState({ data: newData })
    } else {
      newData[index].rename = newData[index].name
      this.setState({ data: newData })
    }
  }

  handleDeleteFiles(idArr) {
    const body = {
      filelist: idArr
    }
    api.deleteDataRoomFile(body).then(data => {
      const newData = this.state.data.slice()
      idArr.map(d => {
        const index = newData.map(m => m.id).indexOf(d)
        newData.splice(index, 1)
      })
      this.setState({ data: newData })
    }).catch(error => {
      this.props.dispatch({
        type: 'app/findError',
        payload: error
      })
    })
  }

  handleOnMoveFiles(files, targetID) {
    const targetFile = this.state.data.filter(f => f.id === targetID)[0]
    if (files.filter(f => f.dataroom !== targetFile.dataroom).length > 0 ) {
      Modal.error({
        title: i18n('dataroom.message.error_move_files_title'),
        content: i18n('dataroom.message.error_move_files_content')
      })
      return
    }
    files.map(m => {
      const body = {
        id: m.id,
        parent: targetID == -999 ? null : targetID
      }
      api.editDataRoomFile(body).then(data => {
        const index = this.state.data.map(m => m.id).indexOf(m.id)
        this.state.data[index].parentId = targetID
        this.setState({ data: this.state.data })
      }).catch(error => {
        this.props.dispatch({
          type: 'app/findError',
          payload: error
        })
      })
    })
  }

  handleUploadFile(file, parentId) {
    const newData = this.state.data
    const parentIndex = newData.map(m => m.id).indexOf(parentId)
    if (parentIndex < 0) return
    const dataroom = newData[parentIndex].dataroom
    const body = {
      dataroom: dataroom,
      filename: file.name,
      isFile: true,
      orderNO: 1,
      parent: parentId == -999 ? null : parentId,
      key: file.response.result.key,
      size: file.size,
      bucket: 'file'
    }

    api.addDataRoomFile(body).then(data => {
      const item = data.data
      const parentId = item.parent || -999

      const name = item.filename
      const rename = item.filename
      const unique = item.id
      const isFolder = !item.isFile
      const date = item.lastmodifytime || item.createdtime
      const newItem = { ...item, parentId, name, rename, unique, isFolder, date }
      newData.push(newItem)
      this.setState({ data: newData })
    }).catch(error => {
      this.props.dispatch({
        type: 'app/findError',
        payload: error
      })
    })
  }

  handleSelectFileUser = (file, user) => {
    const list = [...this.state.fileUserList, {file, user}]
    this.setState({ fileUserList: list })
    const files = list.filter(item => item.user == user).map(item => item.file)
    this.editUserFileList(user, files)
  }

  handleDeselectFileUser = (file, user) => {
    const list = this.state.fileUserList.filter(item => {
      return !(item.file == file && item.user == user)
    })
    this.setState({ fileUserList: list })
    const files = list.filter(item => item.user == user).map(item => item.file)
    this.editUserFileList(user, files)
  }

  editUserFileList = (user, files) => {
    const id = this.state.userDataroomMap[user]
    api.editUserDataRoomFile(id, {files}).then(result => {
      this.getAllUserFile()
    }).catch(error => {
      handleError(error)
    })
  }

  handleChangeUser = (value) => {
    this.setState({ newUser: value })
  }

  handleAddUser = () => {
    const { id, newUser } = this.state
    const param = { dataroom: id, user: newUser }
    api.addUserDataRoom(param).then(result => {
      this.setState({ newUser: null })
      this.getAllUserFile()
    }).catch(error => {
      handleError(error)
    })
  }

  handleDeleteUser = (id) => {
    api.deleteUserDataRoom(id).then(result => {
      this.getAllUserFile()
    }).catch(error => {
      handleError(error)
    })
  }

  handleSelectUser = (value) => {
    this.setState({ selectedUser: value })
    const list = this.state.fileUserList.filter(item => item.user == value)
    this.setState({ targetUserFileList: list })
  }

  handleToggleVisible = (id) => {
    const { selectedUser, targetUserFileList } = this.state
    var list = targetUserFileList.map(item => item.file)

    var index = list.indexOf(id)
    if (index > -1) {
      list = [...list.slice(0, index), ...list.slice(index + 1)]
    } else {
      list = [...list, id]
    }

    this.editUserFileList(selectedUser, list)
  }

  handleMultiVisible = (ids) => {
    const { selectedUser, targetUserFileList } = this.state
    var list = targetUserFileList.map(item => item.file)
    var list2 = [...list]
    ids.forEach(id => {
      if (!list2.includes(id)) {
        list2.push(id)
      }
    })
    this.editUserFileList(selectedUser, list2)
  }

  handleMultiInvisible = (ids) => {
    const { selectedUser, targetUserFileList } = this.state
    var list = targetUserFileList.map(item => item.file)

    var list2 = [...list]
    ids.forEach(id => {
      if (list.includes(id)) {
        let index = list2.indexOf(id)
        list2 = [...list2.slice(0,index), ...list2.slice(index + 1)]
      }
    })

    this.editUserFileList(selectedUser, list2)
  }

  render () {
    return (
      <LeftRightLayout
        location={this.props.location}
        title={i18n('dataroom.project_name') + ' : ' + this.state.title}>

        <FileMgmt
          location={this.props.location}
          isClose={this.state.isClose}
          data={this.state.data}
          onCreateNewFolder={this.handleCreateNewFolder.bind(this)}
          onManageUser={this.showModal}
          userOptions={this.state.userOptions}
          fileUserList={this.state.fileUserList}
          onSelectFileUser={this.handleSelectFileUser}
          onDeselectFileUser={this.handleDeselectFileUser}
          onNewFolderNameChange={this.handleNewFolderNameChange.bind(this)}
          onConfirm={this.handleConfirm.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          onDeleteFiles={this.handleDeleteFiles.bind(this)}
          onMoveFiles={this.handleOnMoveFiles.bind(this)}
          onUploadFile={this.handleUploadFile.bind(this)}
          selectedUser={this.state.selectedUser}
          onSelectUser={this.handleSelectUser}
          targetUserFileList={this.state.targetUserFileList}
          onToggleVisible={this.handleToggleVisible}
          onMultiVisible={this.handleMultiVisible}
          onMultiInvisible={this.handleMultiInvisible}
           />


          <Modal
            title={i18n('dataroom.user_management')}
            footer={null}
            onCancel={this.hideModal}
            visible={this.state.visible}>
            <DataRoomUser
              list={this.state.list}
              newUser={this.state.newUser}
              onSelectUser={this.handleChangeUser}
              onAddUser={this.handleAddUser}
              onDeleteUser={this.handleDeleteUser} />
          </Modal>
      </LeftRightLayout>
    )
  }
}

export default connect()(DataRoom)
