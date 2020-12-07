import Devices from '../Devices.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as devicesApi from '@api/devices.js';

const localVue = createLocalVue();
localVue.use(Vuex);

localStorage.setItem('token', 'my-token');
jest.mock('@api/request.js');

describe('Devices.vue', () => {
  let actions;
  let store;
  let wrapper;

  beforeEach(() => {
    actions = {
      clearActiveDevice: jest.fn(),
      clearActiveRoomName: jest.fn(),
      clearRackLayout: jest.fn(),
      setActiveDevice: jest.fn(),
    };
    store = new Vuex.Store({ actions });
    wrapper = shallowMount(Devices, { localVue, store });
  });

  test('should call clearActiveData when component instance is destroyed', () => {
    const spy = jest.spyOn(wrapper.vm, 'clearActiveData');
    wrapper.destroy();

    expect(spy).toHaveBeenCalled();
  });

  test('should not display an error message on initial render', () => {
    expect(wrapper.find('.message').exists()).toBeFalsy();
  });

  test('should call searchDevice method when Search button is clicked', () => {
    const spy = jest.spyOn(wrapper.vm, 'searchDevice');
    wrapper.setData({ serialNumber: '12345abcde' });
    wrapper.find('.button.search').trigger('click');

    expect(spy).toHaveBeenCalled();
  });

  test('should display an error when an empty serial number is submitted', () => {
    wrapper.find('.button.search').trigger('click');

    expect(wrapper.find('.message').exists()).toBeTruthy();
  });

  test('should close the error when the X button is clicked', () => {
    wrapper.find('.button.search').trigger('click');
    wrapper.find('button.delete').trigger('click');

    expect(wrapper.find('.message').exists()).toBeFalsy();
  });

  test('should display an error when an invalid serial number is submitted', async () => {
    jest.spyOn(devicesApi, 'getDeviceDetails').mockRejectedValueOnce({
      status: 404,
    });

    wrapper.setData({ serialNumber: '12345abcde' });
    wrapper.find('.button.search').trigger('click');

    await new Promise(resolve =>
      setTimeout(() => {
        expect(wrapper.find('.message').exists()).toBeTruthy();

        resolve();
      }, 10)
    );
  });
});
