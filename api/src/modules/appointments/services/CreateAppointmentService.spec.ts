import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmentRepository from '../repositories/fakes/fakeAppointmentsRepository';

let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 3, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      provider_id: '1',
      user_id: '2',
      date: new Date(2020, 8, 3, 13),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1');
  });

  it('should not be able to create two appointment on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 3, 12).getTime();
    });

    const appointmentDate = new Date(2020, 8, 3, 13);

    await createAppointment.execute({
      provider_id: '1',
      user_id: '2',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        provider_id: '1',
        user_id: '2',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 3, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: '1',
        user_id: '2',
        date: new Date(2020, 8, 3, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 3, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: '1',
        user_id: '1',
        date: new Date(2020, 8, 3, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 8, 3, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: '1',
        user_id: '2',
        date: new Date(2020, 8, 4, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id: '1',
        user_id: '2',
        date: new Date(2020, 8, 4, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
