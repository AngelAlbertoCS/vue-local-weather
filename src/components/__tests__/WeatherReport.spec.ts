import { mount, shallowMount, flushPromises } from '@vue/test-utils';
import { vi } from 'vitest';
import WeatherReport from '@/components/WeatherReport.vue';

describe('WeatherReport', () => {
  it('should render the component without crashing', (): void => {
    global.fetch = vi.fn() as any;
    const wrapper = shallowMount(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      },
    });
    expect(wrapper).toBeTruthy();
  });

  it('displays loading message when data is undefined', (): void => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(),
      })
    ) as any;
    const wrapper = shallowMount(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      },
    });
    expect(wrapper.text()).toContain('Loading...');
  });

  it('displays weather data when data is defined', async () => {
    const mockData = {
      current: {
        condition: { text: 'Sunny' },
        temp_c: 25,
        wind_kph: 10,
        wind_degree: 90,
      },
      location: {
        name: 'London',
        region: 'London',
        localtime: new Date().toISOString(),
      },
    };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    ) as any;
    const wrapper = mount(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      },
    });
    await flushPromises();
    expect(wrapper.text()).toContain(mockData.current.condition.text);
    expect(wrapper.text()).toContain(mockData.current.temp_c.toString());
    expect(wrapper.text()).toContain(mockData.location.name);
    expect(wrapper.text()).toContain(mockData.location.region);
    expect(wrapper.text()).toContain(mockData.current.wind_kph.toString());
    expect(wrapper.text()).toContain(mockData.current.wind_degree.toString());
  });

  it('displays formats the datetime to a locale format', async () => {
    const mockDateTime = new Date(2000, 12, 31, 11, 45, 0, 0);
    vi.setSystemTime(mockDateTime);
    const mockData = {
      location: {
        localtime: new Date().toISOString(),
      },
      current: {
        condition: {},
      },
    };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    ) as any;
    const wrapper = mount(WeatherReport, {
      props: {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      },
    });
    await flushPromises();
    const localtime = wrapper.find('[data-testid=localtime]');
    expect(localtime.text()).toEqual('January 31, 2001 at 11:45 AM');
    vi.useRealTimers();
  });
});
