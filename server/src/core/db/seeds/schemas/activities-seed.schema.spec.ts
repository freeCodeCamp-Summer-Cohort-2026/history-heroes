import {
  ActivitySeedFileSchema,
  ActivitySeedItemSchema,
} from './activities-seed.schema';
import * as seedActivitiesJson from './../../../../../data/seeds/initial-activities.json';

describe('Activity item schema', () => {
  it('should exist', () => {
    expect(ActivitySeedItemSchema).toBeDefined();
  });

  it('should be valid against one seed activity', () => {
    ActivitySeedItemSchema.parse(seedActivitiesJson.activities[0]);
  });

  it('should be valid against all seed activities', () => {
    for (const activity of seedActivitiesJson.activities)
      ActivitySeedItemSchema.parse(activity);
  });

  it('should be invalid against an activity with an empty type', () => {
    const activityWithBadType = JSON.parse(
      JSON.stringify(seedActivitiesJson.activities[0]),
    );
    activityWithBadType.type = '';

    const result = ActivitySeedItemSchema.safeParse(activityWithBadType);

    expect(result.success).toBeFalsy();
    expect(result.error).toBeDefined();
  });
});

describe('Activities file schema', () => {
  it('should exist', () => {
    expect(ActivitySeedFileSchema).toBeDefined();
  });

  it('should be valid against copmlete list of seed activities', () => {
    ActivitySeedFileSchema.parse(seedActivitiesJson);
  });

  it('should fail for an empty array', () => {
    const result = ActivitySeedFileSchema.safeParse({ activities: [] });

    expect(result.success).toBeFalsy();
    expect(result.error).toBeDefined();
  });
});
