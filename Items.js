import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import Icon from '@folio/stripes-components/lib/Icon';

class Items extends React.Component {

  static manifest = Object.freeze({
    items: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items?query=(holdingsRecordId=!{holdingsRecord.id})',
    },
  });

  constructor(props) {
    super(props);
    this.editItemModeThisLayer = false;
  }

  onSelectRow = (e, meta) => {
    this.openItem(meta);
  }

  openItem(selectedItem) {
    const itemId = selectedItem.id;
    this.props.history.push(`/inventory/view/${this.props.instance.id}/${this.props.holdingsRecord.id}/${itemId}`);
  }

  render() {
    const { resources: { items } } = this.props;
    if (!items || !items.hasLoaded) return <div />;
    const itemRecords = items.records;
    const itemsFormatter = {
      'Item: barcode': x => <div> <button title="Edit Item" onClick={(e) => { this.onClickEditItem(e, x); }}><Icon icon="edit" /></button> {_.get(x, ['barcode'])}</div>,
      status: x => _.get(x, ['status', 'name']) || '--',
      'Material Type': x => _.get(x, ['materialType', 'name']),
    };
    return (
      <div>
        <MultiColumnList
          id="list-items"
          contentData={itemRecords}
          rowMetadata={['id', 'holdingsRecordId']}
          onRowClick={this.onSelectRow}
          formatter={itemsFormatter}
          visibleColumns={['Item: barcode', 'status', 'Material Type']}
          ariaLabel={'Items'}
          containerRef={(ref) => { this.resultsList = ref; }}
        />
      </div>);
  }
}

Items.propTypes = {
  resources: PropTypes.shape({
    items: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
  history: PropTypes.object,
  instance: PropTypes.object,
  holdingsRecord: PropTypes.object.isRequired,
};

export default Items;