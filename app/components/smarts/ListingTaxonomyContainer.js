import React, { PureComponent } from "react";
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import { connect } from "react-redux";
import he from "he";
import {
  getListingTaxonomy,
  getScrollTo,
  changeListingDetailNavigation,
} from "../../actions";
import _ from "lodash";
import {
  isEmpty,
  ViewWithLoading,
  ContentBox,
  IconTextMedium,
  Row,
  Col,
} from "../../wiloke-elements";
import { ListingLayoutCat, ListingCat } from "../dumbs";
import * as Consts from "../../constants/styleConstants";
class ListingTaxonomyContainer extends PureComponent {
  _getListingTaxonomy = async () => {
    const { getListingTaxonomy, params, type } = this.props;
    const { id, item } = params;
    type === null && getListingTaxonomy(id, item);
  };
  componentDidMount() {
    this._getListingTaxonomy();
  }

  _handleItem = (item) => async () => {
    const { navigation, postType } = this.props;
    postType ? postType : "listing";
    const _results = {
      postType: postType,
      [item.taxonomy]: item.term_id.toString(),
    };
    navigation.push("ListingSearchResultScreen", { _results });
  };

  renderItem = ({ item, index }) => {
    return (
      <Col column={2} gap={10}>
        <TouchableOpacity
          style={{ margin: 5 }}
          onPress={this._handleItem(item)}
        >
          <IconTextMedium
            iconName={!!item.oIcon.icon ? item.oIcon.icon : "check"}
            isImage={item.oIcon.type === "image"}
            urlImage={item.oIcon.url}
            iconSize={30}
            text={he.decode(item.name)}
            texNumberOfLines={1}
            iconColor={!!item.oIcon.color ? "#fff" : Consts.colorDark2}
          />
        </TouchableOpacity>
      </Col>
    );
  };

  renderContent = (id, item, isLoading, datas) => {
    const { settings } = this.props;
    if (datas === "__empty__") {
      return null;
    }

    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        <ContentBox
          headerTitle={item.name}
          headerIcon={item.icon}
          style={{
            marginBottom: 10,
            width: "100%",
          }}
          colorPrimary={settings.colorPrimary}
        >
          <Row gap={10}>
            <FlatList
              data={datas}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.term_id.toString()}
              numColumns={2}
              showsHorizontalScrollIndicator={false}
            />
          </Row>
        </ContentBox>
      </ViewWithLoading>
    );
  };

  render() {
    const { params, listingTaxonomy } = this.props;
    const { id, item } = params;
    const listingID = `${id}_details`;
    const taxonomySections = _.get(
      listingTaxonomy,
      `${listingID}.${item.key}`,
      []
    );
    return this.renderContent(
      id,
      item,
      _.isEmpty(taxonomySections),
      taxonomySections
    );
  }
}

const mapStateToProps = (state) => ({
  translations: state.translations,
  settings: state.settings,
  listingTaxonomy: state.listingTaxonomy,
});

const mapDispatchToProps = {
  getListingTaxonomy,
  getScrollTo,
  changeListingDetailNavigation,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingTaxonomyContainer);
