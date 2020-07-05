import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { connect } from "react-redux";

import { openChart } from "../actions/charts";
import menuUtils from "../menuUtils";
import menuFuncs from "./menu/dataViewerMenuUtils";

class ReactDtaleHotkeys extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.editedCell) {
      return null;
    }
    const { dataId, propagateState, openChart } = this.props;
    const openMenu = () => {
      propagateState({ menuOpen: true });
      menuUtils.buildClickHandler("gridActions", () => propagateState({ menuOpen: false }));
    };
    const openPopup = (type, height = 450, width = 500) => () => {
      if (menuFuncs.shouldOpenPopup(height, width)) {
        menuFuncs.open(`/dtale/popup/${type}`, dataId, height, width);
      } else {
        openChart(_.assignIn({ type, title: _.capitalize(type) }, this.props));
      }
    };
    const openTab = type => () => window.open(menuFuncs.fullPath(`/dtale/popup/${type}`, dataId), "_blank");
    const openCodeExport = () => menuFuncs.open("/dtale/popup/code-export", dataId, 450, 700);
    const keyMap = {
      MENU: "shift+m",
      DESCRIBE: "shift+d",
      FILTER: "shift+f",
      BUILD_COL: "shift+b",
      CHARTS: "shift+c",
      CODE: "shift+x",
    };
    const handlers = {
      MENU: openMenu,
      DESCRIBE: openTab("describe"),
      FILTER: openPopup("filter", 500, 1100),
      BUILD_COL: openPopup("build", 400, 770),
      CHARTS: () => window.open(menuFuncs.fullPath("/charts", dataId), "_blank"),
      CODE: openCodeExport,
    };
    return <GlobalHotKeys keyMap={keyMap} handlers={handlers} />;
  }
}
ReactDtaleHotkeys.displayName = "DtaleHotkeys";
ReactDtaleHotkeys.propTypes = {
  dataId: PropTypes.string.isRequired,
  editedCell: PropTypes.string,
  propagateState: PropTypes.func,
  openChart: PropTypes.func,
};
const ReduxDtaleHotkeys = connect(
  state => _.pick(state, ["dataId", "editedCell"]),
  dispatch => ({
    openChart: chartProps => dispatch(openChart(chartProps)),
  })
)(ReactDtaleHotkeys);

export { ReactDtaleHotkeys, ReduxDtaleHotkeys as DtaleHotkeys };
