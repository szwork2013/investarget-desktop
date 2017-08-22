import React from 'react';
import styles from './RecommendProjects.css';
import { Card, Icon, Tag, Button } from 'antd'

const tagStyle = {
  marginBottom: '8px',
}


function RecommendProjects(props) {

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>收藏项目</h3>

      <div className="clearfix" className={styles.content}>
        {
          props.projects.map(item => {

            const cardBodyStyle = { padding: 0 }
            const cardContentStyle ={ backgroundImage: 'url(' + item.image + ')' }

            const isSelected = props.selectedProjects.includes(item.id)
            const cardCoverStyle = isSelected ? { display: 'flex' } : { display : 'none' }


            const country = item.country ? item.country.country : ''
            const tags = item.tags || []


            return (
                <Card key={item.id} className={styles.card} bordered={false} bodyStyle={cardBodyStyle} onClick={()=>{props.onProjectToggle(item.id)}}>
                  <div className={styles.cardContent} style={cardContentStyle}>
                    <div className={styles.cardDetail}>
                      <h3 className={styles.cardTitle}>{item.projtitle}</h3>
                      <div style={{textAlign: 'left'}}>
                        <Tag color="pink" style={tagStyle}>{country}</Tag>
                        {
                          tags.map(tag => <Tag key={tag.id} color="red" style={tagStyle}>{tag.name}</Tag>)
                        }
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardCover} style={cardCoverStyle}>
                    <div className={styles.cardCoverWrap}>
                      <Icon type="check" className={styles.cardCoverIcon} />
                    </div>
                  </div>
                </Card>
            )
          })
        }
      </div>

      <div className={styles.actions}>
        <Button className={styles.action} onClick={props.onProjectsSkip}>跳过</Button>
        <Button
          className={styles.action}
          disabled={props.selectedProjects.length == 0}
          type="primary"
          onClick={props.onProjectsSubmit}
        >完成选择</Button>
      </div>

    </div>
  )
}


export default RecommendProjects
