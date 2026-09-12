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

    describe('malformed successCriteria ids', () => {
      it('should be invalid when there are too many successCriteria ids', () => {
        dummyOrderingActivity.successCriteria.correctOrder.push('third');
        expectValidationFailure();
      });

      it('should be invalid when there are not enough successCriteria ids', () => {
        dummyOrderingActivity.successCriteria.correctOrder.pop();
        expectValidationFailure();
      });

      it('should be invalid when successCriteria ids do not match', () => {
        dummyOrderingActivity.successCriteria.correctOrder.splice(
          1,
          1,
          'third',
        );
        expectValidationFailure();
      });
    });

    describe('malformed content ids', () => {
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
    });

    describe('misc invalid ids', () => {
      it('should be invalid when there are matching empty ids', () => {
        dummyOrderingActivity.successCriteria.correctOrder.splice(1, 1, '');
        dummyOrderingActivity.content.items.splice(1, 1, {
          id: '',
          label: 'Empty',
        });
        expectValidationFailure();
      });

      it('should be invalid for duplicate ids', () => {
        dummyOrderingActivity.successCriteria.correctOrder.splice(
          1,
          1,
          'first',
        );
        dummyOrderingActivity.content.items.splice(1, 1, {
          id: 'first',
          label: 'First',
        });
        expectValidationFailure();
      });
    });
  });

  describe('should be invalid against a matching activity with various invalid id configurations', () => {
    let dummyMatchingActivity: {
      id: string;
      type: string;
      title: string;
      checkStatement: string;
      content: {
        left: { id: string; label: string }[];
        right: { id: string; label: string }[];
      };
      successCriteria: {
        pairs: { left: string; right: string }[];
      };
    };

    const expectValidationFailure = () => {
      const result = ActivitySeedItemSchema.safeParse(dummyMatchingActivity);

      expect(result.success).toBeFalsy();
      expect(result.error).toBeDefined();
    };

    // reset dummy activity before each test
    beforeEach(() => {
      dummyMatchingActivity = {
        id: 'dummy-matching-activity',
        type: 'matching',
        title: 'Dummy matching activity',
        checkStatement: 'This is a dummy matching activity',
        content: {
          left: [
            {
              id: 'first',
              label: 'First',
            },
            {
              id: 'third',
              label: 'Third',
            },
          ],
          right: [
            {
              id: 'second',
              label: 'Second',
            },
            {
              id: 'fourth',
              label: 'Fourth',
            },
          ],
        },
        successCriteria: {
          pairs: [
            { left: 'first', right: 'second' },
            { left: 'third', right: 'fourth' },
          ],
        },
      };
    });

    it('shoudld be valid for unmodified dummy activity', () => {
      ActivitySeedItemSchema.parse(dummyMatchingActivity);
    });

    describe('malformed successCriteria ids', () => {
      const dummyExtraMatchingPair = {
        left: 'fifth',
        right: 'sixth',
      };

      it('should be invalid when there are too many successCriteria ids', () => {
        dummyMatchingActivity.successCriteria.pairs.push(
          dummyExtraMatchingPair,
        );
        expectValidationFailure();
      });

      it('should be invalid when there are not enough successCriteria ids', () => {
        dummyMatchingActivity.successCriteria.pairs.pop();
        expectValidationFailure();
      });

      it('should be invalid when successCriteria ids do not match', () => {
        dummyMatchingActivity.successCriteria.pairs.splice(
          1,
          1,
          dummyExtraMatchingPair,
        );
        expectValidationFailure();
      });
    });

    describe('malformed content ids', () => {
      const dummyExtraContentLeft = { id: 'fifth', label: 'Fifth' };
      const dummyExtraContentRight = { id: 'sixth', label: 'Sixth' };

      it('should be invalid when there are too many content ids', () => {
        dummyMatchingActivity.content.left.push(dummyExtraContentLeft);
        dummyMatchingActivity.content.right.push(dummyExtraContentRight);
        expectValidationFailure();
      });

      it('should be invalid when there are not enough content ids', () => {
        dummyMatchingActivity.content.left.pop();
        dummyMatchingActivity.content.right.pop();
        expectValidationFailure();
      });

      it('should be invalid when content ids do not match', () => {
        dummyMatchingActivity.content.left.splice(1, 1, dummyExtraContentLeft);
        dummyMatchingActivity.content.right.splice(
          1,
          1,
          dummyExtraContentRight,
        );
        expectValidationFailure();
      });
    });

    describe('misc invalid ids', () => {
      it('should be invalid when there are matching empty ids', () => {
        dummyMatchingActivity.successCriteria.pairs.splice(1, 1, {
          left: '',
          right: '',
        });

        dummyMatchingActivity.content.left.splice(1, 1, {
          id: '',
          label: 'Empty 1',
        });
        dummyMatchingActivity.content.right.splice(1, 1, {
          id: '',
          label: 'Empty 2',
        });

        expectValidationFailure();
      });

      it('should be invalid for duplicate ids', () => {
        dummyMatchingActivity.successCriteria.pairs.splice(1, 1, {
          left: 'first',
          right: 'third',
        });

        dummyMatchingActivity.content.left.splice(1, 1, {
          id: 'first',
          label: 'First',
        });
        dummyMatchingActivity.content.right.splice(1, 1, {
          id: 'third',
          label: 'Third',
        });

        expectValidationFailure();
      });

      it('should be invalid for ids on wrong sides of pair', () => {
        dummyMatchingActivity.successCriteria.pairs.splice(1, 1, {
          left: 'fourth',
          right: 'third',
        });

        console.log(dummyMatchingActivity.successCriteria);

        expectValidationFailure();
      });
    });
  });
});

describe('Activities file schema', () => {
  it('should exist', () => {
    expect(ActivitySeedFileSchema).toBeDefined();
  });

  it('should be valid against complete list of seed activities', () => {
    ActivitySeedFileSchema.parse(seedActivitiesJson);
  });

  it('should fail for an empty array', () => {
    const result = ActivitySeedFileSchema.safeParse({ activities: [] });

    expect(result.success).toBeFalsy();
    expect(result.error).toBeDefined();
  });
});
