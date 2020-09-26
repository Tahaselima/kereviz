import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage,
    Animated,
    RefreshControl,
    ScrollView
} from 'react-native';

//Config
import RBSheet from "react-native-raw-bottom-sheet"; // Bottom Modal
//Components
import ListImage from '../../components/ListImage';
import styles from './style';
import globalStyle from '../../Styles/globalStyle';
import CategoryName from '../../components/CategoryName';
import { Card, LeftImageCard, RightImageCard, TwoColumnGrid } from '../../components/index';
//Store
import { observer, inject } from 'mobx-react';
//Packages
import color from '../../config/color';
import language from '../../config/language';

@inject('TextStore', 'PostDetailStore', 'PostListStore')
@observer
export default class PostView extends Component {

    state = {
        postData: [],
        sliderData: [],
        firstLoading: true,
        numColumns: 1,
        cardType: 1,
        page: 1,
        isLoading: false,
        dataStatus: true,
        isRefreshing: false,
        adsNumber: 0,
        isLoadMore: false,
        scrollY: new Animated.Value(0)
    };

    componentDidMount() {
        this.props.PostListStore.getPostData(1, 'Home');
        this.LoadCardDesign();
    };

    LoadCardDesign = async () => {
        try {
            let cardDesign = await AsyncStorage.getItem('cardDesign');
            cardDesign = JSON.parse(cardDesign);

            this.setState({
                cardType: cardDesign.style,
                numColumns: cardDesign.column,
            })
        } catch (error) {
            console.log("PostView in loadCardDesign function error : " + error);
            //Default Card Design
        }
    };

    //numColumns state update for FlatList grid design change
    ChangeGrid = (gridStlye, columnNumber) => {

        this.setState({
            numColumns: columnNumber,
            cardType: 2,
        })

        let cardDesign = {
            style: gridStlye,
            column: columnNumber,
        };

        AsyncStorage.setItem('cardDesign', JSON.stringify(cardDesign));
    };

    //#region Post Data Processes
    loadMoreData = () => {
        const { PostListStore } = this.props;
        this.setState({
            page: this.state.page + 1
        }, () => {
            if (this.state.dataStatus) {
                PostListStore.isFirstLoading = false;
                PostListStore.getPostData(this.state.page, 'Home')
            }
        })
        console.log("PostView - Load More : " + this.state.page);
    };

    onRefresh = () => {
        const { PostListStore } = this.props;
        this.setState({
            page: 1,
        }, () => {
            if (this.state.dataStatus) {
                PostListStore.isFirstLoading = true;
                PostListStore.getPostData(this.state.page, 'Home', 'refresh')
            }
        })
        console.log("PostView - Load More : " + this.state.page);
    };
    //#endregion
    //#region  FlatList - Slider,Grid -  and Header Processes
    Slider = () => {
        
        const diffClamp = Animated.diffClamp(this.state.scrollY, 0, 60)
        const translateY = diffClamp.interpolate({
            inputRange: [0, 60],
            outputRange: [0, -60]
        })
        return (
                <Animated.View style={{transform: [{translateY: translateY}], 
                    elevation: 7,
                    zIndex: 1000,
                }}>
                    <View style={styles.header}>
                        <Image style={styles.changeImage} source={require('../../img/logo.png')} />
                    </View>
                </Animated.View>
        )
    };

    SliderData = () => {
        const { PostListStore } = this.props;
        return (
            <View style={{marginTop:60}}>
                <FlatList
                    style={styles.postList}
                    renderItem={this.renderSliderData}
                    data={PostListStore.sliderData}
                    key={this.state.cardType}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    pagingEnabled={true}
                    persistentScrollbar={true}
                    style={{height:'auto'}}
                />
            </View>
        )
    }

    renderSliderData = (item, index) => {
        const { TextStore } = this.props;
        return (
            <TouchableOpacity key={index} style={styles.sliderItemAreas} onPress={() => this.goToDetail(item)}>
                 <ListImage style={styles.sliderImage} mediaId={item.item.featured_media} imageHeight={250} />
                 <View style={styles.sliderTextArea}>
                     <CategoryName key={this.state.postData.categoryId} categoryId={item.item.categories[0]} height={24} backgroundColor={color.sliderCategoryBackground} color={'#1D7BF6'} marginBottom={10} />
                     <Text numberOfLines={3} style={styles.sliderTitle}>{TextStore.clearText(item.item.title.rendered)}</Text>
                 </View>
            </TouchableOpacity>
        )
    };

    goToDetail = (data) => {
        const { PostDetailStore } = this.props;
        this.props.navigation.navigate('Details',
            PostDetailStore.changePostDetail(data),
            PostDetailStore.routeName = "HomeStack"
        );
    };

    renderPostData = (item, index) => {
        const { cardType } = this.state;

        if (cardType === 1) {
            return (
                <Card key={index} item={item} onPress={() => this.goToDetail(item)} />
            )
        }

        else if (cardType === 2) {
            return (
                <LeftImageCard key={index} item={item} onPress={() => this.goToDetail(item)} />
            )
        }

        else if (cardType === 3) {
            return (
                <RightImageCard key={index} item={item} onPress={() => this.goToDetail(item)} />
            )
        }
        else if (cardType === 4) {
            return (
                <TwoColumnGrid key={index} item={item} onPress={() => this.goToDetail(item)} />
            )
        }
    }
    //#endregion

    //#region  Design Functions
    LoadingCircle = () => {
        return (
            <View style={{ padding: 25 }}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    

    //#endregion
    render() {
        const { PostListStore } = this.props;
        const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
            const paddingToBottom = 300;
            return layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom;
        };
        return (
            <SafeAreaView style={globalStyle.container}>
                {this.Slider()}
                <ScrollView
                    onScroll={(e) => {
                        this.state.scrollY.setValue(e.nativeEvent.contentOffset.y)
                        if(isCloseToBottom(e.nativeEvent) && !PostListStore.isLoading){
                            this.loadMoreData()
                        }
                    }}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.isRefreshing}
                          onRefresh={this.onRefresh}
                        />
                      }
                    >
                    {this.SliderData()}
                    <FlatList
                        style={styles.postList}
                        renderItem={this.renderPostData}
                        data={PostListStore.postData}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={this.state.numColumns}
                        key={this.state.cardType}
                    />
                    {this.LoadingCircle()}
                </ScrollView>
                
                {/* RBSheet bottom Modal component */}
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={200}
                    duration={350}
                    closeOnDragDown={true}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "flex-start",
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            backgroundColor: "#313131"
                        },
                    }}
                >
                    <View>
                        <Text style={styles.changeText}>{language.itemDesingChange}</Text>
                    </View>
                    <View style={styles.changeButtonArea}>
                        <TouchableOpacity style={styles.gridChangeButton} onPress={() => this.ChangeGrid(1, 1)}>
                            <Image style={styles.changeButtonImage} source={require('../../img/icons/card-list.png')} />
                            <Text stlye={styles.buttonText}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.gridChangeButton} onPress={() => this.ChangeGrid(2, 1)}>
                            <Image style={styles.changeButtonImage} source={require('../../img/icons/left-card-list.png')} />
                            <Text stlye={styles.buttonText}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.gridChangeButton} onPress={() => this.ChangeGrid(3, 1)}>
                            <Image style={styles.changeButtonImage} source={require('../../img/icons/right-card-list.png')} />
                            <Text stlye={styles.buttonText}>3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.gridChangeButton} onPress={() => this.ChangeGrid(4, 2)}>
                            <Image style={styles.changeButtonImage} source={require('../../img/icons/two-grid-columns.png')} />
                            <Text stlye={styles.buttonText}>4</Text>
                        </TouchableOpacity>
                    </View>
                </RBSheet>
            </SafeAreaView>
        );
    }

}

