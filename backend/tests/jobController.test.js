
const { postJob } = require('../controllers/jobController');
const { ErrorHandler } = require('../middlewares/error'); 
const Job = require('../models/jobSchema'); 

jest.mock('../models/jobSchema', () => ({
  create: jest.fn()
}));

describe('postJob', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return error if user role is Job Seeker', async () => {
    req.user.role = 'Job Seeker';

    await postJob(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.anything());
    expect(next.mock.calls[0][0].message).toBe('Job Seeker not allowed to access this resource.');
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  it('should return error if required fields are missing', async () => {
    req.user.role = 'Employer';
    req.body = { title: 'Job Title' }; // Missing other required fields

    await postJob(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.anything());
    expect(next.mock.calls[0][0].message).toBe('Please provide full job details, including job type.');
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  it('should return error if neither fixed nor ranged salary is provided', async () => {
    req.user.role = 'Employer';
    req.body = { title: 'Job Title', description: 'Job Description', category: 'IT', country: 'USA', city: 'NY', location: '123 St', jobType: 'Full-time' };

    await postJob(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.anything());
    expect(next.mock.calls[0][0].message).toBe('Please either provide fixed salary or ranged salary.');
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  it('should return error if both fixed and ranged salary are provided', async () => {
    req.user.role = 'Employer';
    req.body = {
      title: 'Job Title', 
      description: 'Job Description', 
      category: 'IT', 
      country: 'USA', 
      city: 'NY', 
      location: '123 St', 
      jobType: 'Full-time', 
      fixedSalary: 1000, 
      salaryFrom: 800, 
      salaryTo: 1200 
    };

    await postJob(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.anything());
    expect(next.mock.calls[0][0].message).toBe('Cannot Enter Fixed and Ranged Salary together.');
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  it('should successfully create a job if all validations pass', async () => {
    req.user.role = 'Employer';
    req.user._id = 'userId';
    req.body = {
      title: 'Job Title', 
      description: 'Job Description', 
      category: 'IT', 
      country: 'USA', 
      city: 'NY', 
      location: '123 St', 
      jobType: 'Full-time', 
      fixedSalary:1500,
      salaryFrom: 800, 
      salaryTo: 1200 
    };
    
    Job.create.mockResolvedValue({ id: 'jobId' });

    await postJob(req, res, next);

    expect(Job.create).toHaveBeenCalledWith({
      title: 'Job Title',
      description: 'Job Description',
      category: 'IT',
      country: 'USA',
      city: 'NY',
      location: '123 St',
      jobType: 'Full-time',
      salaryFrom: 800,
      salaryTo: 1200,
      postedBy: 'userId',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Job Posted Successfully!',
      job: { id: 'jobId' },
    });
  });
});
