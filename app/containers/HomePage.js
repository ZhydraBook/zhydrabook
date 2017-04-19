// @flow
import { connect } from 'react-redux';
import DownloadList from '../components/DownloadList';
import { updateDownload } from '../actions';


const mapStateToProps = (state) => ({
  downloads: state.downloads
});


const mapDispatchToProps = (dispatch) => ({
  update: (update) => {
    dispatch(updateDownload(update));
  },
});


const VisibleDownloadList = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadList);

export default VisibleDownloadList;
