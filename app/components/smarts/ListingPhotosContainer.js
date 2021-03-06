import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import {
  changeListingDetailNavigation,
  getListingPhotos,
  getScrollTo,
} from "../../actions";
import {
  NewGallery,
  ViewWithLoading,
  isEmpty,
  ContentBox,
  RequestTimeoutWrapped,
} from "../../wiloke-elements";
import { ButtonFooterContentBox } from "../dumbs";
import { screenWidth } from "../../constants/styleConstants";

const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9JREFUeNpifvfuHUCAAQAFpALOO255kgAAAABJRU5ErkJggg==";
class ListingPhotosContainer extends Component {
  state = {
    imageIndex: 0,
    isImageViewVisible: false,
  };

  _getListingPhotos = () => {
    const { params, getListingPhotos, type, listingPhotos, listingPhotosAll } =
      this.props;
    const { id, item, max } = params;
    type === null && getListingPhotos(id, item, max);
  };

  async componentDidMount() {
    this._getListingPhotos();
  }

  renderContent = (id, item, isLoading, photos, type) => {
    const { isListingDetailPhotosRequestTimeout, translations, settings } =
      this.props;
    if (photos === "__empty__") {
      return null;
    }
    return (
      <ViewWithLoading
        isLoading={isLoading}
        contentLoader="contentSquareHeader"
        contentSquareWidth="33.33%"
      >
        {!isEmpty(photos) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon={item.icon}
            style={{
              marginBottom: type !== "all" ? 10 : 50,
              width: "100%",
            }}
            renderFooter={
              item.status &&
              item.status === "yes" &&
              this.renderFooterContentBox(id, item)
            }
            colorPrimary={settings.colorPrimary}
          >
            <RequestTimeoutWrapped
              isTimeout={isListingDetailPhotosRequestTimeout}
              onPress={this._getListingPhotos}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              <NewGallery
                thumbnails={photos.medium.map((item) =>
                  !!item.url ? item.url : DEFAULT_IMAGE
                )}
                modalSlider={photos.large.map((item) =>
                  !!item.url ? item.url : DEFAULT_IMAGE
                )}
                thumbnailMax={type !== "all" && 3}
                colorPrimary={settings.colorPrimary}
              />
            </RequestTimeoutWrapped>
          </ContentBox>
        )}
      </ViewWithLoading>
    );
  };

  renderFooterContentBox = (listingId, item) => {
    const {
      translations,
      changeListingDetailNavigation,
      getListingPhotos,
      getScrollTo,
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(item.key);
          getListingPhotos(listingId, item, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingPhotos,
      listingPhotosAll,
      loadingListingDetail,
      params,
      type,
      listingDetail,
    } = this.props;
    const { item, id } = params;
    const listingID = `${params.id}_details`;

    return type === "all"
      ? this.renderContent(
          id,
          item,
          _.isEmpty(listingPhotosAll[listingID]),
          listingPhotosAll[listingID],
          "all"
        )
      : this.renderContent(
          id,
          item,
          _.isEmpty(listingPhotos[listingID]),
          listingPhotos[listingID]
        );
  }
  // renderFooter = () => {
  //   const {
  //     params,
  //     translations,
  //     changeListingDetailNavigation,
  //     getListingPhotos
  //   } = this.props;
  //   const { status, key } = params.item;
  //   const listingId = params.id;
  //   return (
  //     status === "yes" && (
  //       <ButtonFooterContentBox
  //         text={translations.viewAll.toUpperCase()}
  //         onPress={() => {
  //           changeListingDetailNavigation(key);
  //           getListingPhotos(listingId, key, null);
  //         }}
  //       />
  //     )
  //   );
  // };
  // render() {
  //   const { params, listingPhotos } = this.props;
  //   return (
  //     !isEmpty(listingPhotos) && (
  //       <ContentBox
  //         headerTitle={params.item.name}
  //         headerIcon="image"
  //         style={stylesBase.mb10}
  //         // renderFooter={this.renderFooter()}
  //       >
  //         {this.renderGallery()}
  //       </ContentBox>
  //     )
  //   );
  // }
}

const mapStateToProps = (state) => ({
  listingPhotos: state.listingPhotos,
  listingPhotosAll: state.listingPhotosAll,
  translations: state.translations,
  loadingListingDetail: state.loadingListingDetail,
  isListingDetailPhotosRequestTimeout:
    state.isListingDetailPhotosRequestTimeout,
  settings: state.settings,
  listingDetail: state.listingDetail,
});

export default connect(mapStateToProps, {
  changeListingDetailNavigation,
  getListingPhotos,
  getScrollTo,
})(ListingPhotosContainer);
