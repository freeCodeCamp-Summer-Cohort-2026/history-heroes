import {
  ActivitySeedFileSchema,
  ActivitySeedItemSchema,
} from './activities-seed.schema';
import * as seedActivitiesJson from './../../../../../data/seeds/initial-activities.json';

describe('Activity item schema', () => {
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

  // reset dummy ordering activity before each test
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

  // reset dummy matching activity before each test
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

  describe('ordering activity ids', () => {
    const expectValidationFailure = () => {
      const result = ActivitySeedItemSchema.safeParse(dummyOrderingActivity);

      expect(result.success).toBeFalsy();
      expect(result.error).toBeDefined();
    };

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

    describe('misc id cases', () => {
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

  describe('matching activity ids', () => {
    const expectValidationFailure = () => {
      const result = ActivitySeedItemSchema.safeParse(dummyMatchingActivity);

      expect(result.success).toBeFalsy();
      expect(result.error).toBeDefined();
    };

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

    describe('misc id cases', () => {
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

        expectValidationFailure();
      });

      it('should be valid for identical ids on opposite sides', () => {
        dummyMatchingActivity.successCriteria.pairs.splice(1, 1, {
          left: 'second',
          right: 'first',
        });

        dummyMatchingActivity.content.left.splice(1, 1, {
          id: 'second',
          label: 'Second',
        });
        dummyMatchingActivity.content.right.splice(1, 1, {
          id: 'first',
          label: 'First',
        });

        ActivitySeedItemSchema.parse(dummyMatchingActivity);
      });
    });
  });

  describe('error messages', () => {
    it('should produce different errors for different types of invalid input', () => {
      const dummyActivityEmptyType = JSON.parse(
        JSON.stringify(dummyOrderingActivity),
      );
      dummyActivityEmptyType.type = '';

      const dummyActivityNoSuccess = JSON.parse(
        JSON.stringify(dummyOrderingActivity),
      );
      delete dummyActivityNoSuccess.successCriteria;

      const resultEmptyType = ActivitySeedItemSchema.safeParse(
        dummyActivityEmptyType,
      );
      const resultNoSuccess = ActivitySeedItemSchema.safeParse(
        dummyActivityNoSuccess,
      );

      expect(resultEmptyType.error?.issues[0].message).not.toEqual(
        resultNoSuccess.error?.issues[0].message,
      );
    });

    describe('distinct errors for differently invalid ids', () => {
      let messageMissingId: string;
      let messageMismatchedIds: string;
      let messageDupeIds: string;

      beforeEach(() => {
        const dummyActivityMissingId = JSON.parse(
          JSON.stringify(dummyMatchingActivity),
        );
        dummyActivityMissingId.content.left.pop();
        messageMissingId = ActivitySeedItemSchema.safeParse(
          dummyActivityMissingId,
        ).error?.issues[0].message!;

        const dummyActivityMismatchedIds = JSON.parse(
          JSON.stringify(dummyMatchingActivity),
        );
        dummyActivityMismatchedIds.successCriteria.pairs[0].left = 'invalid';
        messageMismatchedIds = ActivitySeedItemSchema.safeParse(
          dummyActivityMismatchedIds,
        ).error?.issues[0].message!;

        const dummyActivityDupeIds = JSON.parse(
          JSON.stringify(dummyMatchingActivity),
        );
        const dupeId = dummyActivityDupeIds.content.left[0].id;
        dummyActivityDupeIds.content.left.splice[1].id = dupeId;
        messageDupeIds =
          ActivitySeedItemSchema.safeParse(dummyActivityDupeIds).error
            ?.issues[0].message!;
      });

      it('should distinguish missing ids from mismatched ids', () => {
        expect(messageMissingId).not.toEqual(messageMismatchedIds);
      });

      it('should distinguish missing ids from duplicate ids', () => {
        expect(messageMissingId).not.toEqual(messageDupeIds);
      });

      it('should distinguish mismatched ids from duplicate ids', () => {
        expect(messageMismatchedIds).not.toEqual(messageDupeIds);
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
