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

  describe('should be invalid against an ordering activity with various invalid id configurations', () => {
    let dummyOrderingActivity: {
      id: string;
      type: string;
      title: string;
      checkStatement: string;
      content: {
        items: { id: string; label: string }[];
      };
      successCriteria: {
        correctOrder: string[];
      };
    };

    const expectValidationFailure = () => {
      const result = ActivitySeedItemSchema.safeParse(dummyOrderingActivity);

      expect(result.success).toBeFalsy();
      expect(result.error).toBeDefined();
    };

    // reset dummy activity before each test
    beforeEach(() => {
      dummyOrderingActivity = {
        id: 'dummy-ordering-activity',
        type: 'ordering',
        title: 'Dummy ordering activity',
        checkStatement: 'This is a dummy ordering activity',
        content: {
          items: [
            {
              id: 'first',
              label: 'First',
            },
            {
              id: 'second',
              label: 'Second',
            },
          ],
        },
        successCriteria: {
          correctOrder: ['first', 'second'],
        },
      };
    });

    it('shoudld be valid for unmodified dummy activity', () => {
      ActivitySeedItemSchema.parse(dummyOrderingActivity);
    });

    it('should be invalid when there are too many successCriteria ids', () => {
      dummyOrderingActivity.successCriteria.correctOrder.push('third');
      expectValidationFailure();
    });

    it('should be invalid when there are not enough successCriteria ids', () => {
      dummyOrderingActivity.successCriteria.correctOrder.pop();
      expectValidationFailure();
    });

    it('should be invalid when successCriteria ids do not match', () => {
      dummyOrderingActivity.successCriteria.correctOrder.splice(1, 1, 'third');
      expectValidationFailure();
    });

    const dummyThirdContentItem = { id: 'third', label: 'Third' };

    it('should be invalid when there are too many content ids', () => {
      dummyOrderingActivity.content.items.push(dummyThirdContentItem);
      expectValidationFailure();
    });

    it('should be invalid when there are not enough content ids', () => {
      dummyOrderingActivity.content.items.pop();
      expectValidationFailure();
    });

    it('should be invalid when content ids do not match', () => {
      dummyOrderingActivity.content.items.splice(1, 1, dummyThirdContentItem);
      expectValidationFailure();
    });

    it('should be invalid when there are matching empty ids', () => {
      dummyOrderingActivity.successCriteria.correctOrder.splice(1, 1, '');
      dummyOrderingActivity.content.items.splice(1, 1, {
        id: '',
        label: 'Empty',
      });
      expectValidationFailure();
    });
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
