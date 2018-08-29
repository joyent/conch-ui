const m = jest.genMockFromModule('mithril');
m.request = jest.fn( () => {
    return new Promise( reject => { reject(true) } );
});
module.exports = m;
