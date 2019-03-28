import RadialProgress from '../RadialProgress.vue';
import { shallowMount } from '@vue/test-utils';

describe('RadialProgress.vue', () => {
    let methods;
    let propsData;
    let wrapper;

    beforeEach(() => {
        methods = { getTotalLength: jest.fn() };
        propsData = { strokeWidth: '20px', percentage: 100, failing: false };
        wrapper = shallowMount(RadialProgress, { methods, propsData });
    });

    test('should use green as stroke color when percentage is 100', () => {
        expect(wrapper.vm.meterStyle).toEqual('has-stroke-success');
    });

    test('should use red as stroke color when failing is "true"', () => {
        propsData.failing = true;
        wrapper = shallowMount(RadialProgress, { methods, propsData });

        expect(wrapper.vm.meterStyle).toEqual('has-stroke-danger');
    });

    test('should use blue as stroke color when health is not failing and percentage is not 100', () => {
        propsData.percentage = 95;
        wrapper = shallowMount(RadialProgress, { methods, propsData });

        expect(wrapper.vm.meterStyle).toEqual('has-stroke-info');
    });
});
