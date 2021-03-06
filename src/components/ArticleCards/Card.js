import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import ListImage from '../ListImage'
import { observer, inject } from 'mobx-react';


@inject('TextStore')
@observer
export default class Card extends Component {

    state = {
        articleItem: [],
    };

    componentDidMount() {
        this.setState({
            articleItem: this.props.item,
        })
    }

    render() {
        const { TextStore, item, key, onPress } = this.props;
        return (
            <TouchableOpacity key={key} style={styles.listItemAreas} onPress={onPress}>
                <ListImage mediaId={item.item.featured_media} imageHeight={250} imageWidth={'100%'} />
                <View style={styles.listTextArea}>
                    <Text style={styles.listTitle}>{TextStore.clearText(item.item.title.rendered)}</Text>
                    <Text style={styles.listDescription} numberOfLines={4}>{TextStore.clearText(item.item.excerpt.rendered)}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    listItemAreas: {
        marginBottom: 20,
        backgroundColor: '#202429',
        color: '#fff',
        flex: 1,
    },
    listTextArea: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#61dafb',
    },
    listTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: "bold",
        marginBottom: 10,
    },
    listDescription:{
        color: '#fff'
    },
})

