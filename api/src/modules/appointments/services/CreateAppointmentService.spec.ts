import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/fakeAppointmentsRepository';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();

    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      provider_id: '1',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1');
  });

  it('should not be able to create two appointment on the same time', async () => {
    const appointmentDate = new Date();

    await createAppointment.execute({
      provider_id: '1',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        provider_id: '1',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
