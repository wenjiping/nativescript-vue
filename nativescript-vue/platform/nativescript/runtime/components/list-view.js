import LayoutBase from 'ui/layouts/layout-base'

const VUE_VIEW = '_vueViewRef'

export default {
    name: 'list-view',

    template: `<native-list-view ref="listView" @itemLoading="onItemLoading"></native-list-view>`,

    props: {
        items: {
            type: Array,
            required: true
        },
        templateSelector: {
            type: Function,
            default: () => 'default'
        }
    },

    created() {
        // this._templateMap = new Map()
    },

    mounted() {
        // this.setupTemplates()

        this.$refs.listView.setAttr('items', this.items)

        console.log(this.$scopedSlots)
    },

    watch: {
        items(newVal) {
            this.$refs.listView.setAttr('items', newVal)
            this.$refs.listView.view.refresh()
        }
    },

    methods: {
        // setupTemplates() {
        //     const slots = Object.keys(this.$scopedSlots)
        //
        //     slots.forEach((slotName) => {
        //         const keyedTemplate = {
        //             key: slotName,
        //             createView() {
        //                 this.getItemTemplate('foo', 0)
        //                 return view;
        //             }
        //         }
        //         this._templateMap.set(slotName, keyedTemplate)
        //     })
        //
        //     this.setItemTemplates()
        // },
        //
        // setItemTemplates() {
        //     const templates = [];
        //     this._templateMap.forEach(value => {
        //         templates.push(value);
        //     })
        //     this.$refs.listView.setAttr('itemTemplates', templates);
        // },

        onItemLoading(args) {
            const index = args.index
            const items = args.object.items
            const currentItem = typeof items.getItem === 'function' ? items.getItem(index) : items[index]

            let vnode
            if (args.view) {
                vnode = args.view[VUE_VIEW]

                if (!vnode) {
                    console.log('Cant reuse view...')
                }
            }

            if (!vnode) {
                vnode = this.getItemTemplate(currentItem, index)
                args.view = vnode.elm.view
                args.view[VUE_VIEW] = vnode;
            } else {
                vnode = this.getItemTemplate(currentItem, index, vnode)
                args.view[VUE_VIEW] = vnode;
            }
        },

        getItemTemplate(item, index, oldVnode) {
            let context = new ItemContext(item, index)
            let template = this.templateSelector ? this.templateSelector(context) : 'default'
            console.log(template)
            let slot = this.$scopedSlots[template] ? this.$scopedSlots[template] : this.$scopedSlots.default
            let vnode = slot(context)[0]
            this.__patch__(oldVnode, vnode)

            return vnode
        }
    }
}

class ItemContext {
    constructor(item, index) {
        this.$index = index
        if (typeof  item === 'object') {
            Object.assign(this, item)
        } else {
            this.value = item
        }

        // return JSON.parse(JSON.stringify(this))
    }
}